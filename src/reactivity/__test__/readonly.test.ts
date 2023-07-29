import { readonly } from '../reactive'

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
})
