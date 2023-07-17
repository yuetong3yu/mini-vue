let activeEffect: ReactiveEffect | null
class ReactiveEffect {
  private readonly _fn: Function

  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

const globalTargetMaps = new Map()
export function track(target, key) {
  let targetMap: Map<Object, Set<any>> | undefined =
    globalTargetMaps.get(target)
  if (!targetMap) {
    targetMap = new Map()
    globalTargetMaps.set(target, targetMap)
  }

  let depMap = targetMap.get(key)
  if (!depMap) {
    depMap = new Set()
    targetMap.set(key, depMap)
  }

  depMap.add(activeEffect)
}

export function trigger(target, key) {
  const targetMap = globalTargetMaps.get(target)
  const depMap = targetMap.get(key)

  for (const fn of depMap) {
    fn.run()
  }
}

export function effect(fn) {
  const reactiveEffect = new ReactiveEffect(fn)

  reactiveEffect.run()
}
