import { extend } from '../shared'

let activeEffect: ReactiveEffect | null
let shouldTrack: boolean | null

class ReactiveEffect {
  private readonly _fn: Function
  deps: Set<any>[] = []
  isCleanup: boolean = false
  onStop?: () => void

  constructor(fn, public schedular) {
    this._fn = fn
  }

  run() {
    if (this.isCleanup) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this

    const res = this._fn()
    shouldTrack = false
    return res
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
  if (!isTracking()) return

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

  trackEffects(depsSet)
}

export function trackEffects(dep: Set<any>) {
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  activeEffect?.deps.push(dep)
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  const targetMap = globalTargetMaps.get(target)
  const depSet = targetMap.get(key)

  triggerEffects(depSet)
}

export function triggerEffects(dep: Set<any>) {
  for (const fn of dep) {
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
