import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  test('simple happy path', () => {
    const a = reactive({ foo: 1 })
    const dummy = computed(() => {
      return a.foo + 1
    })
    expect(dummy.value).toBe(2)
  })

  test('getter function should be lazily', () => {
    const user = reactive({ age: 1 })
    const getter = jest.fn(() => {
      return user.age
    })
    const computedValue = computed(getter)

    // should not be called before accessing `value`
    expect(getter).not.toBeCalled()
    // after accessing, called once
    expect(computedValue.value).toBe(1)
    expect(getter).toBeCalledTimes(1)

    // should not call again, if value doesn't change
    computedValue.value
    expect(getter).toBeCalledTimes(1)

    // should not call again, until access computed value
    user.age = 2
    expect(getter).toBeCalledTimes(1)

    expect(computedValue.value).toBe(2)
    expect(getter).toBeCalledTimes(2)
  })
})
