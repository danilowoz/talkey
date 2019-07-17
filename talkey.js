const Talkey = {
  // constants
  TEXT_ELEMENT: "TEXT ELEMENT",

  // Process JSX to TalkeyDOM understands this elements
  createObjElement(type, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.length > 0;
    const rawChildren = hasChildren ? [].concat(...args) : [];

    props.children = rawChildren
      .filter(c => c !== null && c !== false)
      .map(c => (c instanceof Object ? c : this.createTextElement(c)));

    return { type, props };
  },

  // only for strings
  createTextElement(value) {
    return this.createObjElement(this.TEXT_ELEMENT, { nodeValue: value });
  }
};

const TalkeyDOM = {
  rootInstance: null,

  instantiate(element) {
    const { type, props } = element;

    // checks
    const isTextElement = type === Talkey.TEXT_ELEMENT;

    /// Create DOM element
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    this.updateDomProperties(dom, [], props);

    // Render children
    const childElements = props.children || [];
    const childInstances = childElements.map(el => this.instantiate(el));
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    return { __type: "TALKEY_Intance", dom, element, childInstances };
  },

  updateDomProperties(dom, prevProps, nextProps) {
    const isListener = name => name.startsWith("on");
    const isAttribute = name => !isListener(name) && name !== "children";

    // Remove event listeners
    Object.keys(prevProps)
      .filter(isListener)
      .forEach(method => {
        const eventType = method.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[method]);
      });

    // Remove attributes
    Object.keys(prevProps)
      .filter(isAttribute)
      .forEach(name => {
        // only if it necessary
        if (dom[name] !== nextProps[name]) {
          dom[name] = null;
        }
      });

    // Add event listeners
    Object.keys(nextProps)
      .filter(isListener)
      .forEach(method => {
        const eventType = method.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[method]);
      });

    // Set properties
    Object.keys(nextProps)
      .filter(isAttribute)
      .forEach(attrName => {
        if (dom[attrName] !== nextProps[attrName]) {
          // if (attrName === "nodeValue") {
          //   console.log(dom);
          //   dom.innerText = nextProps[attrName];
          // } else {
          dom[attrName] = nextProps[attrName];
          // }
        }
      });
  },

  reconcile(parentDom, instance, element) {
    if (instance === null) {
      // Create instance
      const newInstance = this.instantiate(element);
      parentDom.appendChild(newInstance.dom);

      return newInstance;
    } else if (element === null) {
      // Remove instance
      parentDom.removeChild(instance.dom);

      return null;
    } else if (instance.element.type === element.type) {
      // Update instance
      this.updateDomProperties(
        instance.dom,
        instance.element.props,
        element.props
      );

      instance.childInstances = this.reconcileChildren(instance, element);
      instance.element = element;

      return instance;
    } else {
      const newInstance = this.instantiate(element);
      parentDom.replaceChild(newInstance.dom, instance.dom);

      return newInstance;
    }
  },

  reconcileChildren(instance, element) {
    const { dom, childInstances } = instance;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];

    const count = Math.max(childInstances.length, nextChildElements.length);

    for (let i = 0; i < count; i++) {
      const childInstance = childInstances[i];
      const childElement = nextChildElements[i];
      const newChildInstance = this.reconcile(dom, childInstance, childElement);
      newChildInstances.push(newChildInstance);
    }

    return newChildInstances.filter(instance => instance != null);
  },

  render(element, container) {
    const prevInstance = this.rootInstance;
    const nextInstance = this.reconcile(container, prevInstance, element);

    this.rootInstance = nextInstance;
  }
};
