class RefImpl {
  private _val: any

  constructor(val) {
    this._val = val
  }

  get value() {
    return this._val
  }
}

export const ref = (val) => {
  return new RefImpl(val)
}
