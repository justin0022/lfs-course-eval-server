import { readDataByYear, writeToDB, clearCollection } from '../service/dbService.js'
import R from 'ramda'

const aggregateUMIInstructor = (data) => {
  const byInstructor = R.groupBy((course) => course.PUID)
  const result = R.toPairs(byInstructor(data))
  const finalArray = []
  for (var i = 0; i < result.length; i++) {
    const finalObj = {}
    finalObj[result[i][0]] = result[i][1]
    finalArray.push(finalObj)
  }
  return finalArray
}

readDataByYear('2016', 'aggregatedData', (res) => {
  const result = aggregateUMIInstructor(res)
  clearCollection('UMIInstructor')
  writeToDB(result, 'UMIInstructor')
})

export {
    aggregateUMIInstructor
}
