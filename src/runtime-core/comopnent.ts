export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
  }

  return component
}

export function setupComponent(instance: any) {
  // const props = initProps(instance)
  // const slots = initSlots(instance)

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const component = instance.vnode.type

  const { setup } = component

  if (setup) {
    const setupResult = setup()
    // if result is a function, consider it as a render function
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const component = instance.type
  const { render } = component

  instance.render = render
  // if (component.render) {
  // }
}
