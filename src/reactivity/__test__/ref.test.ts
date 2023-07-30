import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, proxyRefs, ref, unRef } from '../ref'

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

describe('isRef', () => {
  test('should only return ref to true', () => {
    const a = ref(1)
    expect(isRef(a)).toBe(true)
    expect(isRef(2)).toBe(false)
    const reactiveObj = reactive({})
    expect(isRef(reactiveObj)).toBe(false)
  })
})

describe('unRef', () => {
  test('unRef should return the original value', () => {
    const a = ref(1)
    expect(isRef(a)).toBe(true)
    expect(unRef(a)).toBe(1)
  })

  test('unRef to a non-ref value, should return itself', () => {
    expect(unRef(1)).toBe(1)
  })
})

describe('proxyRefs', () => {
  test('basic usage', () => {
    const user = {
      age: ref(10),
      gender: 'male',
    }
    const proxyObj = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyObj.age).toBe(10)
    expect(proxyObj.gender).toBe('male')

    proxyObj.age = 20
    expect(proxyObj.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyObj.age = ref(30)
    expect(proxyObj.age).toBe(30)
    expect(user.age.value).toBe(30)
  })
})
