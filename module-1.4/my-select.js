(() => {
  class MySelect extends HTMLElement {
    #optionsBox;
    #templateOption;
    #selectPopup;
    #selectButton;
    #searchField;
    #selectLabel;

    #convertedOptions;
    #selectedValues = new Set();
    #valueToLabel = new Map();
    #placeholderText = "Select a city";
    #isPopupOpen = false;
    #onDocumentPointerDown = (e) => {
      if (!this.#isPopupOpen) return;
      if (this.#isEventInsideComponent(e)) return;
      this.#closePopup();
    };

    constructor() {
      super();
    }

    disconnectedCallback() {
      this.#removeOutsideClickListener();
    }

    connectedCallback() {
      if (this.shadowRoot) return;

      this.attachShadow({ mode: "open" });
      this.#collectInitialOptions()
        .#createOptionTemplate()
        .#render()
        .#removeInitialOptions();
    }

    #collectInitialOptions() {
      const options = this.querySelectorAll("option");

      this.#convertedOptions = Array.from(options).reduce((acc, option) => {
        const value = option.value;
        const label = option.textContent.trim();

        this.#valueToLabel.set(value, label);
        acc.push({ [value]: label });
        return acc;
      }, []);

      return this;
    }

    #createOptionTemplate() {
      const template = document.createElement("template");

      template.className = "option-template";
      template.innerHTML = `<label class="option"><input class="option-checkbox" type="checkbox"/><span class="option-label"></span></label>`;

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

    #render() {
      this.#definePlaceholderText();
      this.#renderLayout();
      this.#cacheDomRefs();
      this.#bindEvents();
      this.#renderOptionsList(this.#convertedOptions);
      this.#updateSelectLabel();
      return this;
    }

    #definePlaceholderText() {
      this.#placeholderText = (this.getAttribute("placeholder") || "Select a city").trim();
      return this;
    }

    #renderLayout() {
      this.shadowRoot.innerHTML = `
      <style>${this.#getSelectStyles()}</style>
      <div class="select-root">
        <button class="select-button" type="button">
          <span class="button-label"></span>
          <span class="button-icon">⌄</span>
        </button>
        <div class="select-popup">
          <div class="search-wrapper">
            <input class="search-field" placeholder="Search..."/>
            <button class="icon-button" type="button">⌕</button>
            <button class="icon-button" type="button">✕</button>
          </div>
          <div class="select-popup-options"></div>
        </div>
      </div>
    `;
      return this;
    }

    #cacheDomRefs() {
      this.#optionsBox = this.shadowRoot.querySelector(".select-popup-options");
      this.#selectPopup = this.shadowRoot.querySelector(".select-popup");
      this.#selectButton = this.shadowRoot.querySelector(".select-button");
      this.#searchField = this.shadowRoot.querySelector(".search-field");
      this.#selectLabel = this.shadowRoot.querySelector(".button-label");
      return this;
    }

    #bindEvents() {
      this.#selectButton.addEventListener("click", this.#togglePopup.bind(this));
      this.#searchField.addEventListener("change", this.#filterOptions.bind(this));
      return this;
    }

    #renderOptionsList(options) {
      options.forEach((option) => {
        const optionEl = this.#createOptionElement(option);
        this.#optionsBox.append(optionEl);
      });
    }

    #createOptionElement(option) {
      const fragment = this.#templateOption.content.cloneNode(true);
      const labelWrapper = fragment.querySelector(".option");
      const labelText = fragment.querySelector(".option-label");
      const input = fragment.querySelector(".option-checkbox");

      const [value, label] = Object.entries(option)[0];

      labelWrapper.dataset.value = value;
      labelText.textContent = label;
      input.checked = this.#selectedValues.has(value);

      input.addEventListener("change", (e) => this.#handleOptionToggle(value, e));

      return labelWrapper;
    }

    #handleOptionToggle(value, event) {
      const isChecked = !!event.target.checked;
      this.#setValueSelected(value, isChecked);
      this.#updateSelectLabel();
    }

    #setValueSelected(value, isSelected) {
      if (isSelected) {
        this.#selectedValues.add(value);
      } else {
        this.#selectedValues.delete(value);
      }
    }

    #updateSelectLabel() {
      const labels = Array.from(this.#selectedValues)
        .map((value) => this.#valueToLabel.get(value))
        .filter(Boolean);

      this.#selectLabel.textContent = labels.length ? labels.join(", ") : this.#placeholderText;
    }

    #cleanOptionsBox() {
      while (this.#optionsBox.firstChild) {
        this.#optionsBox.removeChild(this.#optionsBox.firstChild);
      }
    }

    #removeInitialOptions() {
      this.querySelectorAll("option").forEach((option) => option.remove());
    }

    #togglePopup() {
      if (this.#isPopupOpen) {
        this.#closePopup();
      } else {
        this.#openPopup();
      }
    }

    #openPopup() {
      this.#setPopupOpen(true);
      this.#addOutsideClickListener();
    }

    #closePopup() {
      this.#setPopupOpen(false);
      this.#removeOutsideClickListener();
    }

    #setPopupOpen(isOpen) {
      this.#isPopupOpen = isOpen;
      this.#selectPopup.classList.toggle("open", isOpen);
      this.#selectButton.classList.toggle("open", isOpen);
    }

    #addOutsideClickListener() {
      document.addEventListener("pointerdown", this.#onDocumentPointerDown, true);
    }

    #removeOutsideClickListener() {
      document.removeEventListener("pointerdown", this.#onDocumentPointerDown, true);
    }

    #isEventInsideComponent(event) {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      return path.includes(this);
    }

    #filterOptions(event) {
      const value = (event.target.value || "").trim();

      const filteredOptionsEntries = this.#convertedOptions.filter((option) => {
        const optionEntries = Object.entries(option);
        const label = optionEntries[0][1] || "";
        return value ? label.toLowerCase().includes(value.toLowerCase()) : true;
      });

      this.#cleanOptionsBox();
      this.#renderOptionsList(filteredOptionsEntries);
    }
  }

  const componentName = document.currentScript.dataset.name;

  customElements.define(componentName, MySelect);
})();
