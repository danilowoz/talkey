"use strict";

/** @jsx Talkey.createObjElement */
var app = Talkey.createObjElement("div", {
  id: "container"
}, Talkey.createObjElement("input", {
  value: "foo",
  type: "text",
  onKeyDown: function onKeyDown(e) {
    return console.log(e.target.value);
  }
}), Talkey.createObjElement("button", {
  onClick: function onClick(e) {
    return console.log("Hi");
  }
}, "click me"), Talkey.createObjElement("br", null), Talkey.createObjElement("ul", null, Talkey.createObjElement("li", null, "foo")), Talkey.createObjElement("p", null, "foo", " ", Talkey.createObjElement("strong", null, "strong element ", Talkey.createObjElement("span", null, "span"))));
TalkeyDOM.render(app, document.getElementById("app"));
