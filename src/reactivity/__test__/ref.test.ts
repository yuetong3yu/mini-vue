import { effect } from '../effect'
import { ref } from '../ref'

describe('ref', () => {
  test('should include a `value` property, which equal to original value', () => {
    const val = 1
    const refVal = ref(val)
    expect(refVal).not.toBe(val)
    expect(refVal.value).toBe(1)
  })

  test("should be a reactive value, but same value won't trigger effect", () => {
    const refValue = ref(1)
    let dummy
    let effectCallTimes = 0
    effect(() => {
      effectCallTimes++
      dummy = refValue.value
    })
    // init effect, should execute once
    expect(dummy).toBe(1)
    expect(effectCallTimes).toBe(1)
    // reactive, increase call times
    refValue.value = 2
    expect(dummy).toBe(2)
    expect(effectCallTimes).toBe(2)
    // if update to the same value, won't trigger
    refValue.value = 2
    expect(dummy).toBe(2)
    expect(effectCallTimes).toBe(2)
  })

  test('nested ref', () => {
    const refObj = ref({
      foo: 1,
    })
    let dummy
    effect(() => {
      dummy = refObj.value.foo
    })
    expect(dummy).toBe(1)
    refObj.value.foo = 2
    expect(dummy).toBe(2)
  })
})
