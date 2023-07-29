import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

const baseGet = createGetter()
const baseSet = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return (target, key) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) return res

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
