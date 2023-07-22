import { extend } from '../shared'

let activeEffect: ReactiveEffect | null
class ReactiveEffect {
  private readonly _fn: Function
  deps: Set<any>[] = []
  isCleanup: boolean = false
  onStop?: () => void

  constructor(fn, public schedular) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (!this.isCleanup) {
      cleanupEffect(this)
      if (this.onStop) this.onStop()
      this.isCleanup = true
    }
  }
}

function cleanupEffect(reactiveEffect) {
  reactiveEffect.deps.forEach((dep) => {
    dep.delete(reactiveEffect)
  })
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

  if (!activeEffect) return

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
  // assign to reactiveEffect
  extend(reactiveEffect, options)

  reactiveEffect.run()

  const runner: any = reactiveEffect.run.bind(reactiveEffect)

  runner.effect = reactiveEffect

  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
