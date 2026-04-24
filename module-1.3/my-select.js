class MySelect extends HTMLElement {
  #optionsBox;
  #templateOption;
  #convertedOptions;
  #shadow;
  #selectPopup;
  #selectButton;

  constructor() {
    super();
  }

  connectedCallback() {
    // this.#shadow = this.attachShadow({ mode: "open" });
    this.#defineInitialOptions()
      .#createTemplateOption()
      .#renderSelect()
      .#removeInitialOptions();
  }

  #createTemplateOption() {
    const template = document.createElement("template");

    template.className = "option-template";
    template.innerHTML = `<label class="option"><input type="checkbox"/></label>`;

    this.append(template);

    this.#templateOption = this.querySelector(".option-template");

    return this;
  }

  #defineInitialOptions() {
    const options = this.querySelectorAll("option");

    this.#convertedOptions = Array.from(options).reduce((acc, option) => {
      acc.push({ [option.value]: option.textContent.trim() });
      return acc;
    }, []);

    return this;
  }

  #renderSelect() {
    this.innerHTML = `
     <style>
        my-select {
          position: relative;
          display: inline-block;
        }
        .select-popup {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
        }
 
        .select-popup.open {
          display: block;
        }
    </style>
    <button class="select-button">Кнопка</button>
    <div class="select-popup">
      <input id="search" placeholder="Search..." />
      <div class="select-popup-options"></div>
    </div>
    `;

    this.#optionsBox = this.querySelector(".select-popup-options");
    this.#selectPopup = this.querySelector(".select-popup");
    this.#selectButton = this.querySelector(".select-button");
    
    this.#selectButton.addEventListener("click", this.#openPopup.bind(this));

    this.#renderOptions(this.#convertedOptions);

    return this;
  }

  #renderOptions(options) {
    options.forEach((option) => {
      const optionTemplate = this.#templateOption.content.cloneNode(true);
      const labelWrapper = optionTemplate.querySelector(".option");

      const optionEntries = Object.entries(option);
      labelWrapper.dataset.value = optionEntries[0][0];
      labelWrapper.append(optionEntries[0][1]);

      this.#optionsBox.append(labelWrapper);
    });
  }

  #removeInitialOptions() {
    this.querySelectorAll("option").forEach((option) => option.remove());
  }

  #openPopup() {
    this.#selectPopup.classList.toggle("open");
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MySelect);
