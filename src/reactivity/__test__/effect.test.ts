import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const age = reactive({
      age: 10,
    })
    let newAge
    effect(() => {
      newAge = age.age + 1
    })

    expect(newAge).toBe(11)
    age.age++
    expect(newAge).toBe(12)
  })

  describe('effect should return a runner, and when the runner execute, it would return whatever pass-in function returns', () => {
    const foo = { foo: 1 }

    const runner = effect(() => {
      foo.foo++
    })

    it('effect should execute once', () => {
      expect(foo.foo).toBe(2)
    })

    it('when run runner function, should update foo', () => {
      runner()
      expect(foo.foo).toBe(3)
    })
  })
})

describe('schedular', () => {
  it('happy path', () => {
    let run
    let dummy
    const schedular = jest.fn(() => {
      run = runner
    })
    const foo = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = foo.foo
      },
      { schedular }
    )

    expect(schedular).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    foo.foo++
    expect(schedular).toBeCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })
})

describe('stop', () => {
  it('happy path', () => {
    let dummy
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    })
    expect(dummy).toBe(1)
    obj.foo = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.foo = 3
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })

  it('call stop multiple times', () => {
    let dummy
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    })
    expect(dummy).toBe(1)
    stop(runner)
    obj.foo = 2
    expect(dummy).toBe(1)
    stop(runner)
    runner()
    expect(dummy).toBe(2)
  })
})

describe('onStop handler', () => {
  it('should be called when stop be called', () => {
    const onStop = jest.fn(() => {})
    const runner = effect(
      () => {
        console.log('hello world')
      },
      { onStop }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
