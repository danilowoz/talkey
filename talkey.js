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
  render(element, parentDom) {
    const { type, props } = element;

    // checks
    const isTextElement = type === Talkey.TEXT_ELEMENT;
    const isListener = name => name.startsWith("on");
    const isAttribute = name => !isListener(name) && name !== "children";

    /// Create DOM element
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    // Add event listeners
    Object.keys(props)
      .filter(isListener)
      .forEach(method => {
        const eventType = method.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[method]);
      });

    // Set properties
    Object.keys(props)
      .filter(isAttribute)
      .forEach(attrName => {
        dom[attrName] = props[attrName];
      });

    // Render children
    const childElements = props.children || [];
    childElements.forEach(child => this.render(child, dom));

    // Append to parent
    parentDom.appendChild(dom);
  }
};
