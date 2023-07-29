import { isReadonly, readonly, shallowReadonly } from '../reactive'

describe('readonly', () => {
  it('should return a new object, with same property values', () => {
    const obj = { foo: 1, buz: { tip: 2 } }
    const readonlyProperty = readonly(obj)
    expect(readonlyProperty).not.toBe(obj)
    expect(readonlyProperty.foo).toBe(1)
    expect(readonlyProperty.buz.tip).toBe(2)
  })

  it('when set value to readonly object, should get warning', () => {
    console.warn = jest.fn()

    const obj = readonly({ foo: 1 })
    obj.foo = 2
    expect(console.warn).toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('isReadonly', () => {
    const obj = { foo: 1 }
    expect(isReadonly(obj)).toBe(false)
    expect(isReadonly(null)).toBe(false)

    const readonlyObj = readonly(obj)
    expect(isReadonly(readonlyObj)).toBe(true)
  })

  it('nested isReadonly', () => {
    const complexObj = {
      foo: {
        bar: 1,
      },
      array: [1],
    }

    const readonlyObj = readonly(complexObj)
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(isReadonly(readonlyObj.foo)).toBe(true)
    expect(isReadonly(readonlyObj.array)).toBe(true)
  })
})

describe('shallowReadonly', () => {
  it('only first level should be readonly', () => {
    const obj = {
      foo: {
        bar: 1,
      },
    }
    const readonlyObj = shallowReadonly(obj)
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(isReadonly(readonlyObj.foo)).toBe(false)
  })

  it('when set to first level, expect a warning', () => {
    console.warn = jest.fn()

    const obj = {
      foo: {
        bar: 1,
      },
    }
    const readonlyObj = shallowReadonly(obj)
    readonlyObj.foo = { bar: 2 }
    expect(console.warn).toBeCalled()
  })

  it('when set to deeper level, expect not warning', () => {
    console.warn = jest.fn()

    const obj = {
      foo: {
        bar: 1,
      },
    }
    const readonlyObj = shallowReadonly(obj)
    readonlyObj.foo.bar = 2
    expect(console.warn).not.toBeCalled()
  })
})
