import { reactive, isReactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(1)
    expect(original.foo).toBe(observed.foo)
  })

  it('isReactive', () => {
    expect(isReactive(1)).toBe(false)

    const obj = { foo: 1 }
    expect(isReactive(obj)).toBe(false)

    const reactiveObj = reactive({})
    expect(isReactive(reactiveObj)).toBe(true)
  })
})
