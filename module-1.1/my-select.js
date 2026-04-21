class MySelect extends HTMLElement {
  constructor() {
    super();
    console.log("Hello World");
  }

  connectedCallback() {
    this.innerHTML = "<p>Это кастомный веб-компонент!</p>"
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MySelect);
