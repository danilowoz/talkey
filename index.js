function render(element, parentDom) {
  const { type, props } = element;

  // checks
  const isTextElement = type === "TEXT_ELEMENT";
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
  childElements.forEach(child => render(child, dom));

  // Append to parent
  parentDom.appendChild(dom);
}
