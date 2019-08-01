"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/** @jsx Talkey.createObjElement */
var Talkey = {
  // constants
  TEXT_ELEMENT: "TEXT ELEMENT",
  // Process JSX to TalkeyDOM understands this elements
  createObjElement: function createObjElement(type, config) {
    var _ref,
        _this = this;

    var props = Object.assign({}, config);

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var hasChildren = args.length > 0;
    var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];
    props.children = rawChildren.filter(function (c) {
      return c !== null && c !== false;
    }).map(function (c) {
      return c instanceof Object ? c : _this.createTextElement(c);
    });
    return {
      type: type,
      props: props
    };
  },
  // only for strings
  createTextElement: function createTextElement(value) {
    return this.createObjElement(this.TEXT_ELEMENT, {
      nodeValue: value
    });
  },
  Component:
  /*#__PURE__*/
  function () {
    function Component(props) {
      _classCallCheck(this, Component);

      this.props = props;
      this.state = this.state || {};
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(partialState) {
        // this.setState((prevState) => ({foo: true}))
        // this.setState({foo: true})
        var prevState = this.state;

        if (typeof partialState === "function") {
          this.state = partialState(this.state);
        } else {
          this.state = _objectSpread({}, prevState, {}, partialState);
        }

        TalkeyDOM.updateInstance(this.__internalInstance);
      }
    }]);

    return Component;
  }()
};
var TalkeyDOM = {
  rootInstance: null,
  instantiate: function instantiate(element) {
    var _this2 = this;

    var type = element.type,
        props = element.props;
    var isDomElement = typeof type === "string";

    if (isDomElement) {
      // checks
      var isTextElement = type === Talkey.TEXT_ELEMENT; /// Create DOM element

      var dom = isTextElement ? document.createTextNode("") : document.createElement(type);
      this.updateDomProperties(dom, [], props); // Render children

      var childElements = props.children || [];
      var childInstances = childElements.map(function (el) {
        return _this2.instantiate(el);
      });
      var childDoms = childInstances.map(function (childInstance) {
        return childInstance.dom;
      });
      childDoms.forEach(function (childDom) {
        return dom.appendChild(childDom);
      });
      var instance = {
        __type: "TALKEY_Intance",
        dom: dom,
        element: element,
        childInstances: childInstances
      };
      return instance;
    } else {
      var _instance = {};
      var publicInstance = this.createPublicInstance(element, _instance);
      var childElement = publicInstance.render();
      var childInstance = this.instantiate(childElement);
      var _dom = childInstance.dom;
      Object.assign(_instance, {
        dom: _dom,
        element: element,
        childInstance: childInstance,
        publicInstance: publicInstance
      });
      return _instance;
    }
  },
  createPublicInstance: function createPublicInstance(element, internalInstance) {
    var type = element.type,
        props = element.props;
    var publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
  },
  reconcile: function reconcile(parentDom, instance, element) {
    if (instance == null) {
      // Create instance
      var newInstance = this.instantiate(element);
      parentDom.appendChild(newInstance.dom);
      return newInstance;
    } else if (element == null) {
      // Remove instance
      parentDom.removeChild(instance.dom);
      return null;
    } else if (instance.element.type !== element.type) {
      // Replace instance
      var _newInstance = this.instantiate(element);

      parentDom.replaceChild(_newInstance.dom, instance.dom);
      return _newInstance;
    } else if (typeof element.type === "string") {
      // Update dom instance
      this.updateDomProperties(instance.dom, instance.element.props, element.props);
      instance.childInstances = this.reconcileChildren(instance, element);
      instance.element = element;
      return instance;
    } else {
      //Update composite instance
      instance.publicInstance.props = element.props;
      var childElement = instance.publicInstance.render();
      var oldChildInstance = instance.childInstance;
      var childInstance = this.reconcile(parentDom, oldChildInstance, childElement);
      instance.dom = childInstance.dom;
      instance.childInstance = childInstance;
      instance.element = element;
      return instance;
    }
  },
  reconcileChildren: function reconcileChildren(instance, element) {
    var dom = instance.dom,
        childInstances = instance.childInstances;
    var nextChildElements = element.props.children || [];
    var newChildInstances = [];
    var count = Math.max(childInstances.length, nextChildElements.length);

    for (var i = 0; i < count; i++) {
      var childInstance = childInstances[i];
      var childElement = nextChildElements[i];
      var newChildInstance = this.reconcile(dom, childInstance, childElement);
      newChildInstances.push(newChildInstance);
    }

    return newChildInstances.filter(function (instance) {
      return instance != null;
    });
  },
  updateInstance: function updateInstance(internalInstance) {
    var parentDom = internalInstance.dom.parentNode;
    var element = internalInstance.element;
    this.reconcile(parentDom, internalInstance, element);
  },
  updateDomProperties: function updateDomProperties(dom, prevProps, nextProps) {
    var isListener = function isListener(name) {
      return name.startsWith("on");
    };

    var isAttribute = function isAttribute(name) {
      return !isListener(name) && name !== "children";
    }; // Remove event listeners


    Object.keys(prevProps).filter(isListener).forEach(function (method) {
      var eventType = method.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[method]);
    }); // Remove attributes

    Object.keys(prevProps).filter(isAttribute).forEach(function (name) {
      // only if it necessary
      if (dom[name] !== nextProps[name]) {
        dom[name] = null;
      }
    }); // Add event listeners

    Object.keys(nextProps).filter(isListener).forEach(function (method) {
      var eventType = method.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[method]);
    }); // Set properties

    Object.keys(nextProps).filter(isAttribute).forEach(function (attrName) {
      if (dom[attrName] !== nextProps[attrName]) {
        dom[attrName] = nextProps[attrName];
      }
    });
  },
  render: function render(element, container) {
    var prevInstance = this.rootInstance;
    var nextInstance = this.reconcile(container, prevInstance, element);
    this.rootInstance = nextInstance;
  }
}; //
//  Component
//

var Button =
/*#__PURE__*/
function (_Talkey$Component) {
  _inherits(Button, _Talkey$Component);

  function Button(props) {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, props));
  }

  _createClass(Button, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["children"]);

      return Talkey.createObjElement("div", null, "Button:", Talkey.createObjElement("button", props, children));
    }
  }]);

  return Button;
}(Talkey.Component);

var App =
/*#__PURE__*/
function (_Talkey$Component2) {
  _inherits(App, _Talkey$Component2);

  function App(props) {
    var _this3;

    _classCallCheck(this, App);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));

    _defineProperty(_assertThisInitialized(_this3), "add", function () {
      _this3.setState({
        counter: _this3.state.counter + 1
      });
    });

    _defineProperty(_assertThisInitialized(_this3), "decrease", function () {
      _this3.setState(function (prevState) {
        return {
          counter: prevState.counter - 1
        };
      });
    });

    _this3.state = {
      counter: 0
    };
    return _this3;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return Talkey.createObjElement("div", null, Talkey.createObjElement("p", null, this.state.counter), Talkey.createObjElement(Button, {
        onClick: this.decrease
      }, "- decrease"), this.state.counter < 10 && Talkey.createObjElement(Button, {
        onClick: this.add
      }, "+ add"));
    }
  }]);

  return App;
}(Talkey.Component);

var rootDom = document.getElementById("app");
TalkeyDOM.render(Talkey.createObjElement(App, null), rootDom);
