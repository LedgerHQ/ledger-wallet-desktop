import Page from "./page";

export default class ModalPage extends Page {
  async container() {
    return this.$("#modal-container");
  }

  async content() {
    return this.$("#modal-content");
  }

  async title() {
    return this.$("#modal-title");
  }

  async termsCheckbox() {
    return this.$("#modal-terms-checkbox");
  }

  async confirmButton() {
    return this.$("#modal-confirm-button");
  }

  async continueButton() {
    return this.$("#modal-continue-button");
  }

  async saveButton() {
    return this.$("#modal-save-button");
  }

  async cancelButton() {
    return this.$("#modal-cancel-button");
  }

  async closeButton() {
    return this.$("#modal-close-button");
  }

  async newPasswordInput() {
    return this.$("#new-password-input");
  }

  async confirmPasswordInput() {
    return this.$("#confirm-password-input");
  }

  async currentPasswordInput() {
    return this.$("#current-password-input");
  }

  async disablePasswordInput() {
    return this.$("#disable-password-input");
  }

  async waitForDisplayed(o) {
    const elem = await this.container();
    return elem.waitForDisplayed(o);
  }

  async close() {
    const elem = await this.closeButton();
    return elem.click();
  }

  async confirm() {
    const elem = await this.confirmButton();
    return elem.click();
  }
}
