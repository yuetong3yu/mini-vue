let activeEffect: ReactiveEffect | null
class ReactiveEffect {
  private readonly _fn: Function
  deps: Set<any>[] = []

  constructor(fn, public schedular) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    this.deps.forEach((dep) => {
      dep.delete(this)
    })
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

  let depsSet = targetMap.get(key)
  if (!depsSet) {
    depsSet = new Set()
    targetMap.set(key, depsSet)
  }

  depsSet.add(activeEffect)
  activeEffect?.deps.push(depsSet)
}

export function trigger(target, key) {
  const targetMap = globalTargetMaps.get(target)
  const depMap = targetMap.get(key)

  for (const fn of depMap) {
    if (fn.schedular) {
      fn.schedular()
    } else {
      fn.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  const schedular = options?.schedular
  const reactiveEffect = new ReactiveEffect(fn, schedular)

  reactiveEffect.run()

  const runner: any = reactiveEffect.run.bind(reactiveEffect)

  runner.effect = reactiveEffect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
