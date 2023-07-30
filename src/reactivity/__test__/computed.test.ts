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
})
