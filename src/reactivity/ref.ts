import { hasChanged, isObject } from '../shared'
import { trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _val: any
  private _rawValue: any
  public deps: Set<any>

  constructor(val) {
    this._rawValue = val
    this._val = isObject(val) ? reactive(val) : val
    this.deps = new Set()
  }

  get value() {
    trackEffects(this.deps)
    return this._val
  }

  set value(newValue) {
    if (!hasChanged(newValue, this._rawValue)) return

    this._rawValue = newValue
    this._val = isObject(newValue) ? reactive(newValue) : newValue
    triggerEffects(this.deps)
  }
}

export const ref = (val) => {
  return new RefImpl(val)
}
