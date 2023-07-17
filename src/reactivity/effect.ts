class ReactiveEffect {
  private readonly _fn: Function

  constructor(fn) {
    this._fn = fn
  }

  run() {
    this._fn()
  }
}

export function effect(fn) {
  const reactiveEffect = new ReactiveEffect(fn)

  reactiveEffect.run()
}
