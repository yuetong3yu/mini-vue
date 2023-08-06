function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // const props = initProps(instance)
    // const slots = initSlots(instance)
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.vnode.type;
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        // if result is a function, consider it as a render function
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    const { render } = component;
    instance.render = render;
    // if (component.render) {
    // }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // processElement(vnode, container)
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const componentInstance = createComponentInstance(vnode);
    setupComponent(componentInstance);
    setupRenderEffect(componentInstance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // get vnode
    patch(subTree);
}

function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
    };
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
