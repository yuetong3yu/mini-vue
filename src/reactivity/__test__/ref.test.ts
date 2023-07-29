import { ref } from '../ref'

describe('ref', () => {
  test('should include a `value` property, which equal to original value', () => {
    const val = 1
    const refVal = ref(val)
    expect(refVal).not.toBe(val)
    expect(refVal.value).toBe(1)
  })
})
