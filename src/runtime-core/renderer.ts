import { createComponentInstance, setupComponent } from './comopnent'

export function render(vnode, container) {
  patch(vnode, container)
}

export function patch(vnode, container) {
  processComponent(vnode, container)
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const componentInstance = createComponentInstance(vnode)

  setupComponent(componentInstance)

  setupRenderEffect(componentInstance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()

  // get vnode

  patch(subTree, container)
}
