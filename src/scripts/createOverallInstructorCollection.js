import { readAggregatedDataByYear } from '../service/dbService.js'
import R from 'ramda'
import * as calculate from '../utils/calculate'

readAggregatedDataByYear('2016', (res) => {
  aggregateOverallInstructor(res)
})

const aggregateOverallInstructor = (data) => {
  const byInstructor = R.groupBy((course) => course.PUID)

  const sumCount = (umi, val, tuple) =>
    R.reduce((acc, record) => (acc + record[umi].count[val]), 0, tuple[1])

  const sumGender = (gen, tuple) =>
    R.reduce((acc, record) => (acc + record.gender[gen]), 0, tuple[1])

  const sumEnrolment = (tuple) =>
    R.reduce((acc, record) => (acc + record.enrolment), 0, tuple[1])

  const result = R.reduce((acc, tuple) => {
    const instructorObj = {
      instructorName: tuple[1][0].instructorName,
      gender: {
        Female: sumGender('Female', tuple),
        Male: sumGender('Male', tuple)
      },
      enrolment: sumEnrolment(tuple)
    }

    for (let i = 1; i <= 6; i++) {
      instructorObj['UMI' + i] = {
        count: {
          '1': sumCount('UMI' + i, '1', tuple),
          '2': sumCount('UMI' + i, '2', tuple),
          '3': sumCount('UMI' + i, '3', tuple),
          '4': sumCount('UMI' + i, '4', tuple),
          '5': sumCount('UMI' + i, '5', tuple)
        }
      }
    }
    acc.push(instructorObj)
    return acc
  }, [], R.toPairs(byInstructor(data)))
  return result
  // TODO: add dispersionIndex, average, percentFavourable, responseRate
}

export {
  aggregateOverallInstructor
}