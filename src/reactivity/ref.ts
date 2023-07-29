import { hasChanged } from '../shared'
import { trackEffects, triggerEffects } from './effect'

class RefImpl {
  private _val: any
  public deps: Set<any>

  constructor(val) {
    this._val = val
    this.deps = new Set()
  }

  get value() {
    trackEffects(this.deps)
    return this._val
  }

  set value(newValue) {
    if (!hasChanged(newValue, this._val)) return

    this._val = newValue
    triggerEffects(this.deps)
  }
}

export const ref = (val) => {
  return new RefImpl(val)
}
