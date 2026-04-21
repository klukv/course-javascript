class MySelect extends HTMLElement {
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #templateOption;

  constructor() {
    super();
    console.log("Hello World");
  }

  connectedCallback() {
    this.#createTemplateOption();
    this.#createHTMLSelect();
  }

  #createHTMLSelect() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
    <button class="select-button"></button>
    <div class="select-popup">
      <input placeholder="Search..." />
      <div class="select-popup-options"></div>
    </div>
    `;

    this.append(wrapper);

    const options = this.querySelectorAll("option");

    

    this.#selectButton = this.querySelector(".select-button");
    this.#selectPopup = this.querySelector(".select-popup");
    this.#selectPopupSearch = this.querySelector(".select-popup-search");
    this.#optionsBox = this.querySelector(".select-popup-options");
  }

  #createTemplateOption() {
    const template = document.createElement("template");

    template.innerHTML = `<label class="option"><input type="checkbox"/><label>`;
    this.append(template);

    this.#templateOption = this.querySelector("option");
  }

  #renderOptions(options) {
    options.forEach((option) => {
      const optionWrapper = this.#templateOption.content.cloneNode(true);

      const optionEntries = Object.entries(option);
      optionWrapper.dataset.value = optionEntries[0];
      optionWrapper.textContent = optionEntries[1];

      this.#optionsBox.append(optionWrapper);
    });
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MySelect);
