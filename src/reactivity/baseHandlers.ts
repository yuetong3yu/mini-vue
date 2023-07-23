import { track, trigger } from './effect'

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
  get: createGetter(),
  set: createSetter(),
}

export const readonlyHandlers = {
  get: createGetter(true),
  set(target, key, value) {
    return true
  },
}
