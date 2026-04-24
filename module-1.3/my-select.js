class MySelect extends HTMLElement {
  #optionsBox;
  #templateOption;
  #convertedOptions;
  #selectPopup;
  #selectButton;

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.#defineInitialOptions()
      .#createTemplateOption()
      .#renderSelect()
      .#removeInitialOptions();
  }

  #defineInitialOptions() {
    const options = this.querySelectorAll("option");

    this.#convertedOptions = Array.from(options).reduce((acc, option) => {
      acc.push({ [option.value]: option.textContent.trim() });
      return acc;
    }, []);

    return this;
  }

  #createTemplateOption() {
    const template = document.createElement("template");

    template.className = "option-template";
    template.innerHTML = `<label class="option"><input type="checkbox"/></label>`;

    this.shadowRoot.append(template);

    this.#templateOption = this.shadowRoot.querySelector(".option-template");

    return this;
  }

  #renderSelect() {
    this.shadowRoot.innerHTML = `
     <style>
        :host {
          position: relative;
          display: inline-block;
        }

        .select-popup {
          display: none;
          position: absolute;
          top: 130%;
          left: 0;
          min-width: 181px;
          transform-origin: center top;
          color: var(--q-input-panel-text, #000000);
          background: var(--q-input-panel-bg, #ffffff);
          border: 0 none;
          border-radius: var(--q-border-radius-md, .375rem);
          box-shadow: var(--q-box-shadow-popup, 0 4px 12px 0 rgba(72, 78, 81, .1));
        }
 
        .select-popup.open {
          display: block;
        }

        .search-field {
          display: inline-block;
          background: var(--q-input-bg, #ffffff);
          color: var(--q-input-text, #0c2d4a);
          border: 1px solid var(--q-input-border, #e6e6e6);
          border-radius: var(--q-input-border-radius, .375rem);
          box-shadow: var(--q-input-shadow, inset 3px 3px 5px #d2d5d7, inset -1px -1px 5px #ffffff);
          outline: none;
          font-family: inherit;
          appearance: none;
          transition: border-color .2s ease-out;
          padding: 0;
          margin: 0;
          text-overflow: ellipsis;
          font-size: var(--q-input-fs, .875rem);
          line-height: var(--q-input-lh, 1.25rem);
          padding: var(--q-input-padding, .5625rem .75rem);
          height: -moz-fit-content;
          height: fit-content;
        }

        .select-popup-options {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
    </style>
    <button class="select-button">Кнопка</button>
    <div class="select-popup">
      <input name="search" class="search-field" placeholder="Search..." />
      <div class="select-popup-options"></div>
    </div>
    `;

    this.#optionsBox = this.shadowRoot.querySelector(".select-popup-options");
    this.#selectPopup = this.shadowRoot.querySelector(".select-popup");
    this.#selectButton = this.shadowRoot.querySelector(".select-button");

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
