import assert from 'assert'
import * as filter from '../src/utils/filter'
import R from 'ramda'

describe('filterByYear', () => {
    it('takes a year and filters an array of objects to return only objects with that year', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
            {term: '2019W1', courseNum: 'LFSLC 100 001'},
        ]
        const output2017 = [
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W1', courseNum: 'LFSLC 100 001'},
        ]
        const filterBy2017 = filter.byYear(2017)
        assert.deepEqual(filterBy2017(input), output2017)

        const output2016 = [
            {term: '2016W1', courseNum: 'LFSLC 100 001'}
        ]
        const filterBy2016 = filter.byYear(2016)
        assert.deepEqual(filterBy2016(input), output2016)

        const filterBy2020 = filter.byYear(2020)
        assert.deepEqual(filterBy2020(input), [])
    })
})
describe('filterByTerm', () => {
    it('takes a term and filters an array of objects to return only objects with that term', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001'},
            {term: '2017W2', courseNum: 'LFSLC 100 001'},
            {term: '2017S1', courseNum: 'LFSLC 100 001'},
            {term: '2017S1', courseNum: 'LFSLC 100 001'},
            {term: '2019S2', courseNum: 'LFSLC 100 001'},
        ]
        const outputS1 = [
            {term: '2017S1', courseNum: 'LFSLC 100 001'},
            {term: '2017S1', courseNum: 'LFSLC 100 001'}
        ]
        const filterByS1 = filter.byTerm('S1')
        assert.deepEqual(filterByS1(input), outputS1)

        const filterByW1 = filter.byTerm('W1')
        assert.deepEqual(filterByW1(input), [{term: '2016W1', courseNum: 'LFSLC 100 001'}])

        const filterByWA = filter.byTerm('WA')
        assert.deepEqual(filterByWA(input), [])
    })
})
describe('filterByInstructor', () => {
    it('takes an instructor and filters an array of objects to return only objects with that instructor', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'},
            {term: '2017W2', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', id: '0987654321'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Doe John', id: '0987654321'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Alice Bob', id: '1234567ABC'}
        ]
        const outputJohnDoe = [
            {term: '2016W1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'},
            {term: '2017W2', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', id: 'ABCDEFGABEGDF'}
        ]
        const filterJohnDoe = filter.byInstructor('ABCDEFGABEGDF')
        assert.deepEqual(filterJohnDoe(input), outputJohnDoe)

        const outputAliceBob = [{term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Alice Bob', id: '1234567ABC'}]
        const filterAliceBob = filter.byInstructor('1234567ABC')
        assert.deepEqual(filterAliceBob(input), outputAliceBob)

        const filterJustinLee = filter.byInstructor('AB1')
        assert.deepEqual(filterJustinLee(input), [])
    })
})
describe('filterByDept', () => {
    it('takes a dept and filters an array of objects to return only objects with that dept', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017W2', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'LFS'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Alice Bob', deptName: 'APBI'}
        ]
        const outputAPBI = [
            {term: '2016W1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017W2', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Alice Bob', deptName: 'APBI'}
        ]
        const filterByAPBI = filter.byDept('APBI')
        assert.deepEqual(filterByAPBI(input), outputAPBI)
        
        const outputLFS = [
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'LFS'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'}
        ]
        const filterByLFS = filter.byDept('LFS')
        assert.deepEqual(filterByLFS(input), outputLFS)
    })
})
describe('filterByYearAndTerm', () => {
    it('takes a year and term and filters an array of objects to return only objects with that year and term', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001'},
            {term: '2016W1', courseNum: 'LFSLC 200 001'},
            {term: '2016W1', courseNum: 'LFSLC 300 001'},
            {term: '2017W2', courseNum: 'LFSLC 100 001'},
            {term: '2017S1', courseNum: 'LFSLC 100 001'},
            {term: '2017S1', courseNum: 'LFSLC 100 001'},
            {term: '2019S2', courseNum: 'LFSLC 100 001'},
        ]
        const output = [
            {term: '2016W1', courseNum: 'LFSLC 100 001'},
            {term: '2016W1', courseNum: 'LFSLC 200 001'},
            {term: '2016W1', courseNum: 'LFSLC 300 001'}
        ]
        const filter2016W1 = filter.byYearAndTerm(2016, 'W1')
        assert.deepEqual(filter2016W1(input), output)
        const filter2017W2 = filter.byYearAndTerm(2017, 'W2')
        assert.deepEqual(filter2017W2(input), [{term: '2017W2', courseNum: 'LFSLC 100 001'}])

        const filterBy2020W1 = filter.byYearAndTerm(2020, 'W1')
        assert.deepEqual(filterBy2020W1(input), [])
    })
})
describe('filterByCourseNum', () => {
    it('takes an array of objects and returns only objects that contain the specified course num', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 200 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017W2', courseNum: 'LFSLC 200 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'LFS'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 200 001', instructor: 'Alice Bob', deptName: 'APBI'}
        ]
        const output = [
            {term: '2016W1', courseNum: 'LFSLC 200 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017W2', courseNum: 'LFSLC 200 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2019S2', courseNum: 'LFSLC 200 001', instructor: 'Alice Bob', deptName: 'APBI'}
        ]
        const filterByLFSLC200001 = filter.byCourseNum('LFSLC 200 001')
        assert.deepEqual(filterByLFSLC200001(input), output)
    })
})
describe('filterByMany', () => {
    it('takes an arbitrary length of filters and returns thoes filters piped', () => {
        const input = [
            {term: '2016W1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017W2', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'APBI'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'LFS'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
            {term: '2019S2', courseNum: 'LFSLC 100 001', instructor: 'Alice Bob', deptName: 'APBI'}
        ]
        const output2017LFS = [
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'John Doe', deptName: 'LFS'},
            {term: '2017S1', courseNum: 'LFSLC 100 001', instructor: 'Doe John', deptName: 'LFS'},
        ]
        const filterByYear2017AndLFS = R.pipe(filter.byYear(2017), filter.byDept('LFS'))
        assert.deepEqual(filterByYear2017AndLFS(input), output2017LFS)

        const filterByYear2017S1 = R.pipe(filter.byYear(2017), filter.byTerm('S1'))
        assert.deepEqual(filterByYear2017AndLFS(input), output2017LFS)
    })
})