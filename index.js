/** @jsx Talkey.createObjElement */

const app = (
  <div id="container">
    <input
      value="foo"
      type="text"
      onKeyDown={e => console.log(e.target.value)}
    />

    <button onClick={e => console.log("Hi")}>click me</button>
    <br />
    <ul>
      <li>foo</li>
    </ul>
    <p>
      foo{" "}
      <strong>
        strong element <span>span</span>
      </strong>
    </p>
  </div>
);

TalkeyDOM.render(app, document.getElementById("app"));
