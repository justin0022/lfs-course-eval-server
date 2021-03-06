import R from 'ramda'

const toTwoDecimal = decimal => Math.round(decimal * 100) / 100

const questionAvg = arr => {
  const sumOfRatings = R.reduce((total, x) => total + (x.percentResponses * x.classSize * x.Avg), 0)(arr)
  const sumOfClassSize = R.reduce((sum, x) => sum + (x.percentResponses * x.classSize), 0)(arr)
  return parseFloat(sumOfRatings / sumOfClassSize).toFixed(2)
}

const avgByField = (arr, field) => {
  const fieldArray = R.map(x => x[field], arr)
  return parseFloat(R.mean(fieldArray)).toFixed(1)
}

const percentGender = (gender, arr) => {
  const countOfSpecifiedGender = arr.filter(x => x.gender === gender).length
  if (arr.length === 0) return 0
  return countOfSpecifiedGender / arr.length
}

const percentileRankingOfCourse = (course, umi, allCoursesSortedByUMI) => {
  const averageOfCourse = course[umi].average
  const numberOfCoursesBelowUMIAverageofCourse = allCoursesSortedByUMI.filter(x => x[umi].average < averageOfCourse).length
  const numberOfCoursesWithExactlyTheSameUMIAverageOfCourse = allCoursesSortedByUMI.filter(x => x[umi].average === averageOfCourse).length

  const result = R.divide(
    R.add(numberOfCoursesBelowUMIAverageofCourse,
      R.multiply(0.5, numberOfCoursesWithExactlyTheSameUMIAverageOfCourse))
    , allCoursesSortedByUMI.length)

  if (result < 0.01) return 0.01
  if (result > 0.99) return 0.99
  else return toTwoDecimal(result)
}

// this 'fills in' any missing counts with 0
const fillInMissingCounts = count => {
  for (let i = 1; i <= 5; i++) {
    const key = String(i)
    if (!count.hasOwnProperty(key)) count[key] = 0
  }
  return count
}

const dispersionIndex = count => {
  count = fillInMissingCounts(count)

  const numberOfResponses = Object.keys(count).reduce((acc, curKey) => (acc += count[curKey]), 0)
  const dispersionObj = {}

  for (let i = 1; i <= 5; i++) {
    const key = String(i)
    const prevKey = String(i - 1)
    dispersionObj[key] = {
      count: count[key],
      proportion: count[key] / numberOfResponses
    }
    if (i === 1) dispersionObj[key].cumulativeProp = dispersionObj[key].proportion
    else dispersionObj[key].cumulativeProp = dispersionObj[prevKey].cumulativeProp + dispersionObj[key].proportion
    dispersionObj[key].oneMinusF = 1 - dispersionObj[key].cumulativeProp
    dispersionObj[key].finalF = dispersionObj[key].cumulativeProp * dispersionObj[key].oneMinusF
  }

  return toTwoDecimal(Object.keys(dispersionObj).reduce((acc, key) => (acc += dispersionObj[key].finalF), 0))
}

const umiAvg = count => {
  count = fillInMissingCounts(count)

  const numberOfResponses = Object.keys(count).reduce((acc, curKey) => (acc += count[curKey]), 0)
  const UMITimesCount = Object.keys(count).reduce((acc, key) => (acc += count[key] * Number(key)), 0)

  return toTwoDecimal(UMITimesCount / numberOfResponses)
}

const percentFavourable = count => {
  count = fillInMissingCounts(count)

  const numberOfResponses = Object.keys(count).reduce((acc, curKey) => (acc += count[curKey]), 0)
  const numberOf4and5s = R.add(R.prop('4', count), R.prop('5', count))

  return toTwoDecimal(numberOf4and5s / numberOfResponses)
}

const expandCount = count => {
  let result = []
  Object.keys(count).map(x => {
    const temp = Array(count[x]).fill(Number(x))
    result = [...result, ...temp]
  })
  return result
}

const sumCount = counts => counts.reduce((acc, cur) => {
  cur = fillInMissingCounts(cur)
  for (let scoreIndex = 1; scoreIndex <= 5; scoreIndex++) {
    if (acc[scoreIndex + '']) {
      acc[scoreIndex + ''] = acc[scoreIndex + ''] + cur[scoreIndex + '']
    } else acc[scoreIndex + ''] = cur[scoreIndex + '']
  }
  return acc
}, {})

const standardDeviation = values => {
  const mean = values.reduce((acc, cur) => (acc + cur), 0) / values.length

  const squareDiffs = values.map(val => {
    const diff = val - mean
    const sqrDiff = diff * diff
    return sqrDiff
  })

  const avgSquareDiff = squareDiffs.reduce((acc, cur) => (acc + cur), 0) / squareDiffs.length

  const stdDev = Math.sqrt(avgSquareDiff)
  return toTwoDecimal(stdDev)
}

const meetsMinimum = (classSize, responseRate) => {
  if (classSize <= 10 && responseRate >= 0.75) return true
  if (classSize >= 11 && classSize <= 19 && responseRate >= 0.65) return true
  if (classSize >= 20 && classSize <= 34 && responseRate >= 0.55) return true
  if (classSize >= 35 && classSize <= 49 && responseRate >= 0.40) return true
  if (classSize >= 50 && classSize <= 74 && responseRate >= 0.35) return true
  if (classSize >= 75 && classSize <= 99 && responseRate >= 0.25) return true
  if (classSize >= 100 && classSize <= 149 && responseRate >= 0.2) return true
  if (classSize >= 150 && classSize <= 299 && responseRate >= 0.15) return true
  if (classSize >= 300 && classSize <= 499 && responseRate >= 0.10) return true
  if (classSize > 500 && responseRate >= 0.05) return true
  else return false
}

export {
  percentGender,
  toTwoDecimal,
  dispersionIndex,
  questionAvg,
  avgByField,
  umiAvg,
  percentFavourable,
  percentileRankingOfCourse,
  meetsMinimum,
  expandCount,
  standardDeviation,
  sumCount
}
