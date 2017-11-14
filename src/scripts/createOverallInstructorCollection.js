import { readDataByYear, writeToDB, clearCollection } from '../service/dbService.js'
import R from 'ramda'
import * as calculate from '../utils/calculate'

const sumCount = (umi, val, classes) =>
  R.reduce((acc, record) => (acc + record[umi].count[val]), 0, classes)

const sumGender = (gen, classes) =>
  R.reduce((acc, record) => (acc + record.gender[gen]), 0, classes)

const sumEnrolment = (classes) =>
  R.reduce((acc, record) => (acc + record.enrolment), 0, classes)

const sumResponded = (classes) =>
  R.reduce((acc, record) => (acc + (record.responseRate * record.enrolment)), 0, classes)

const sumCourseCount = (classes) =>
  R.reduce((acc, record) => (acc + 1), 0, classes)

const concatenateDept = (instructorRecord) =>
  R.uniq(instructorRecord.map(course => course.dept))

const aggregateOverallInstructor = (data) => {
  const byInstructor = R.groupBy((course) => course.PUID)(data)
  const pairedInstructorData = Object.keys(byInstructor).map(key => {
    const PUID = key
    const Courses = byInstructor[key]
    return {
      PUID,
      Courses
    }
  })
  const result = R.reduce((acc, instructorRecord) => {
    const classes = instructorRecord.Courses
    const instructorObj = {
      instructorName: classes[0].instructorName,
      gender: {
        Female: sumGender('Female', classes),
        Male: sumGender('Male', classes)
      },
      numCoursesTaught: classes.length,
      numStudentsTaught: sumEnrolment(classes),
      responseRate: sumResponded(classes) / sumEnrolment(classes),
      dept: concatenateDept(classes).join(', ')
    }

    for (let i = 1; i <= 6; i++) {
      instructorObj['UMI' + i] = {
        count: {
          '1': sumCount('UMI' + i, '1', classes),
          '2': sumCount('UMI' + i, '2', classes),
          '3': sumCount('UMI' + i, '3', classes),
          '4': sumCount('UMI' + i, '4', classes),
          '5': sumCount('UMI' + i, '5', classes)
        }
      }
      instructorObj['UMI' + i]['dispersionIndex'] = calculate.dispersionIndex(instructorObj['UMI' + i].count)
      instructorObj['UMI' + i]['average'] = calculate.umiAvg(instructorObj['UMI' + i].count)
      instructorObj['UMI' + i]['percentFavourable'] = calculate.percentFavourable(instructorObj['UMI' + i].count)
    }
    acc.push(instructorObj)
    return acc
  }, [], pairedInstructorData)
  return result
}

readDataByYear('2016', 'aggregatedData', (res) => {
  const result = aggregateOverallInstructor(res)
  clearCollection('OverallInstructor')
  writeToDB(result, 'OverallInstructor')
})

export {
  aggregateOverallInstructor
}
