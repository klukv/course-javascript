(() => {
class MyPanel extends HTMLElement {
  #headerEl;
  #footerEl;
  #actionsSlot;
  #footerSlot;

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.shadowRoot) return;

    this.attachShadow({ mode: "open" });

    this.#render()
      .#cacheDom()
      .#syncVisibility()
      .#bind();
  }

  #render() {
    const headerText = (this.getAttribute("header") || "").trim();

    this.shadowRoot.innerHTML = `
      <style>${this.#getPanelStyles()}</style>
      <section class="p-panel" part="root">
        <header class="p-panel-header" part="header">
          <div class="p-panel-title" part="title">${headerText}</div>
          <div class="p-panel-icons" part="actions">
            <slot name="actions"></slot>
          </div>
        </header>

        <div class="p-panel-content" part="content">
          <slot></slot>
        </div>

        <footer class="p-panel-footer" part="footer">
          <slot name="footer"></slot>
        </footer>
      </section>
    `;

    return this;
  }

  #cacheDom() {
    this.#headerEl = this.shadowRoot.querySelector(".p-panel-header");
    this.#footerEl = this.shadowRoot.querySelector(".p-panel-footer");
    this.#actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
    this.#footerSlot = this.shadowRoot.querySelector('slot[name="footer"]');
    return this;
  }

  #bind() {
    this.#actionsSlot.addEventListener("slotchange", this.#syncVisibility.bind(this));
    this.#footerSlot.addEventListener("slotchange", this.#syncVisibility.bind(this));
    return this;
  }

  #syncVisibility() {
    const headerText = (this.getAttribute("header") || "").trim();
    const hasTitle = headerText.length > 0;
    const hasActions = this.#slotHasContent(this.#actionsSlot);
    const hasFooter = this.#slotHasContent(this.#footerSlot);

    this.#headerEl.hidden = !(hasTitle || hasActions);
    this.#footerEl.hidden = !hasFooter;

    return this;
  }

  #slotHasContent(slotEl) {
    return slotEl
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || (n.textContent || "").trim());
  }

  #getPanelStyles() {
    return `
      :host {
        display: block;
        font-family: Inter, "Segoe UI", Tahoma, sans-serif;
        color: #0f172a;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      .p-panel {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #ffffff;
        overflow: hidden;
      }

      .p-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }

      .p-panel-title {
        min-width: 0;
        font-size: 16px;
        line-height: 20px;
        font-weight: 600;
        color: #0f172a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .p-panel-icons {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex-shrink: 0;
      }

      .p-panel-content {
        padding: 14px;
      }

      .p-panel-footer {
        padding: 12px 14px;
        border-top: 1px solid #e2e8f0;
        background: #ffffff;
      }

      .p-panel-header[hidden],
      .p-panel-footer[hidden] {
        display: none;
      }
    `;
  }
}

const componentName = document.currentScript.dataset.name;

customElements.define(componentName, MyPanel);
})();
