import { baseHandlers, readonlyHandlers } from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = 'IS_REACTIVE',
  IS_READONLY = 'IS_READONLY',
}

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler)
}

export function reactive(raw) {
  return createActiveObject(raw, baseHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(obj): boolean {
  if (typeof obj !== 'object') return false
  return !!obj?.[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(obj): boolean {
  if (typeof obj !== 'object') return false
  return !!obj?.[ReactiveFlags.IS_READONLY]
}
