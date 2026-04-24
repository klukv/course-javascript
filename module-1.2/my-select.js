class MySelect extends HTMLElement {
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #templateOption;

  constructor() {
    super();
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
      <input id="search" placeholder="Search..." />
      <div class="select-popup-options"></div>
    </div>
    `;

    this.append(wrapper);

    const options = this.querySelectorAll("option");

    const convertedOptions = Array.from(options).reduce((acc, option) => {
      acc.push({ [option.value]: option.textContent.trim() });
      return acc;
    }, []);

    this.#selectButton = this.querySelector(".select-button");
    this.#selectPopup = this.querySelector(".select-popup");
    this.#selectPopupSearch = this.querySelector(".select-popup-search");
    this.#optionsBox = this.querySelector(".select-popup-options");

    this.#renderOptions(convertedOptions);

    options.forEach(option => option.remove())
  }

  #createTemplateOption() {
    const template = document.createElement("template");

    template.id = "option-template"
    template.innerHTML = `<label class="option"><input type="checkbox"/></label>`;

    document.body.append(template);

    this.#templateOption = document.getElementById("option-template");
  }

  #renderOptions(options) {
    options.forEach((option) => {
      const optionTemplate = this.#templateOption.content.cloneNode(true);
      const labelWrapper = optionTemplate.querySelector('.option');

      const optionEntries = Object.entries(option);
      labelWrapper.dataset.value = optionEntries[0][0];
      labelWrapper.append(optionEntries[0][1]);

      this.#optionsBox.append(labelWrapper)
    });
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MySelect);
