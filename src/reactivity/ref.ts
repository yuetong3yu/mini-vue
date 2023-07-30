import { hasChanged, isObject } from '../shared'
import { trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

export enum RefInternalKey {
  isRef = '__is_ref',
}

class RefImpl {
  private _val: any
  private _rawValue: any
  public deps: Set<any>
  private [RefInternalKey.isRef] = true

  constructor(val) {
    this._rawValue = val
    this._val = convertValue(val)
    this.deps = new Set()
  }

  get value() {
    trackEffects(this.deps)
    return this._val
  }

  set value(newValue) {
    if (!hasChanged(newValue, this._rawValue)) return

    this._rawValue = newValue
    this._val = convertValue(newValue)
    triggerEffects(this.deps)
  }
}

function convertValue(value) {
  return isObject(value) ? reactive(value) : value
}

export const ref = (val) => {
  return new RefImpl(val)
}

export function isRef(ref) {
  return !!ref[RefInternalKey.isRef]
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
  })
}
