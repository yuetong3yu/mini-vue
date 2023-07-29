import { reactive, readonly, isProxy } from '../reactive'

describe('isProxy', () => {
  it('plain object should be false', () => {
    const obj = {}
    expect(isProxy(obj)).toBe(false)
  })

  it('reactive should be true', () => {
    const obj = reactive({})
    expect(isProxy(obj)).toBe(true)
  })

  it('readonly should be true', () => {
    const obj = readonly({})
    expect(isProxy(obj)).toBe(true)
  })
})
