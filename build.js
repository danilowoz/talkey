"use strict";

/** @jsx Talkey.createObjElement */
// const app = (
//   <div id="container">
//     <input
//       value="foo"
//       type="text"
//       onKeyDown={e => console.log(e.target.value)}
//     />
//     <button onClick={e => console.log("Hi")}>click me</button>
//     <br />
//     <ul>
//       <li>foo</li>
//     </ul>
//     <p>
//       foo{" "}
//       <strong>
//         strong element <span>span</span>
//       </strong>
//     </p>
//   </div>
// );
// TalkeyDOM.render(app, document.getElementById("app"));
var rootDom = document.getElementById("app");

function tick() {
  var time = new Date().toLocaleTimeString();
  var clockElement = Talkey.createObjElement("div", {
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
  }, "click me"), Talkey.createObjElement("br", null), Talkey.createObjElement("ul", null, Talkey.createObjElement("li", null, "foo")), Talkey.createObjElement("p", {
    className: time
  }, "foo", " ", Talkey.createObjElement("strong", null, "strong element ", Talkey.createObjElement("span", null, time))));
  TalkeyDOM.render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);
