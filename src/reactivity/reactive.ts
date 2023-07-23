import { baseHandlers, readonlyHandlers } from './baseHandlers'

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler)
}

export function reactive(raw) {
  return createActiveObject(raw, baseHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
