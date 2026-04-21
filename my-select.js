class MySelect extends HTMLElement {
  constructor() {
    super();
    console.log("Hello World");
  }
}

customElements.define("my-select", MySelect);
