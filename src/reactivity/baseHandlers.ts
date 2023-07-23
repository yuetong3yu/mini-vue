import { track, trigger } from './effect'

const baseGet = createGetter()
const baseSet = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return (target, key) => {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

export const baseHandlers = {
  get: baseGet,
  set: baseSet,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`Can not set ${value} to a readonly object - ${key}`)
    return true
  },
}
