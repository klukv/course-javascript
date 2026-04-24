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
    template.innerHTML = `<label class="option"><input type="checkbox"/><span class="option-label"></span></label>`;

    this.shadowRoot.append(template);

    this.#templateOption = this.shadowRoot.querySelector(".option-template");

    return this;
  }

  #getSelectStyles() {
    return `
      :host {
        position: relative;
        display: inline-flex;
        min-width: 280px;
        font-family: Inter, "Segoe UI", Tahoma, sans-serif;
        color: #1f2937;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .select-root {
        width: 100%;
      }

      .select-button {
        width: 100%;
        min-height: 42px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: #ffffff;
        color: #475569;
        font-size: 16px;
        line-height: 20px;
        cursor: pointer;
        transition: border-color .2s ease, box-shadow .2s ease;
      }

      .select-button:hover {
        border-color: #94a3b8;
      }

      .select-button:focus-visible {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, .2);
      }

      .button-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .button-icon {
        flex-shrink: 0;
        color: #2563eb;
        transition: transform .2s ease;
      }

      .select-popup {
        display: none;
        margin-top: 8px;
        width: 100%;
        background: #ffffff;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(15, 23, 42, .16);
        overflow: hidden;
      }

      .select-popup.open {
        display: block;
      }

      .select-button.open .button-icon {
        transform: rotate(180deg);
      }

      .search-wrapper {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 10px;
        align-items: center;
      }

      .search-field {
        width: 100%;
        min-height: 34px;
        border: 1px solid #93c5fd;
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 14px;
        line-height: 18px;
        color: #0f172a;
      }

      .search-field::placeholder {
        color: #94a3b8;
      }

      .search-field:focus-visible {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
      }

      .icon-button {
        width: 24px;
        height: 24px;
        border: 0;
        background: transparent;
        color: #334155;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .select-popup-options {
        display: flex;
        flex-direction: column;
        max-height: 220px;
        overflow-y: auto;
      }

      .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        cursor: pointer;
        color: #0f172a;
      }

      .option:hover {
        background: #f8fafc;
      }

      .option input {
        margin: 0;
      }

      .option-label {
        font-size: 16px;
        line-height: 20px;
      }
    `;
  }

  #renderSelect() {
    this.shadowRoot.innerHTML = `
      <style>${this.#getSelectStyles()}</style>
      <div class="select-root">
        <button class="select-button" type="button">
          <span class="button-label">Select a city</span>
          <span class="button-icon">⌄</span>
        </button>
        <div class="select-popup">
          <div class="search-wrapper">
            <input name="search" class="search-field" placeholder="Search..." />
            <button class="icon-button" type="button">⌕</button>
            <button class="icon-button" type="button">✕</button>
          </div>
          <div class="select-popup-options"></div>
        </div>
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
      const labelText = optionTemplate.querySelector(".option-label");

      const optionEntries = Object.entries(option);
      labelWrapper.dataset.value = optionEntries[0][0];
      labelText.textContent = optionEntries[0][1];

      this.#optionsBox.append(labelWrapper);
    });
  }

  #removeInitialOptions() {
    this.querySelectorAll("option").forEach((option) => option.remove());
  }

  #openPopup() {
    const isOpen = this.#selectPopup.classList.toggle("open");
    this.#selectButton.classList.toggle("open", isOpen);
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MySelect);
