import Page from "./page";

export default class SwapPage extends Page {
  async goToChangelly() {
    const changelly = await this.$("#swap-providers-item-changelly");
    await changelly.click();
    const continueButton = await this.$("#swap-providers-continue");
    await continueButton.click();
  }

  async KYCCheckbox() {
    return this.$("#swap-landing-kyc-tos");
  }

  async KYCContinueButton() {
    return this.$("#swap-landing-kyc-continue-button");
  }

  async form() {
    return this.$("#swap-form");
  }

  async tradeMethodInfo() {
    return this.$("#swap-form-trade-method-info");
  }

  async tradeMethodTooltip() {
    return this.$("#swap-form-trade-method-tooltip");
  }

  async tradeMethod() {
    return this.$("#swap-form-trade-method");
  }

  async tradeMethodFloat() {
    return this.$("#swap-form-trade-method-float");
  }

  async tradeMethodFixed() {
    return this.$("#swap-form-trade-method-fixed");
  }

  async fromCurrency() {
    return this.$("#swap-form-from-currency input");
  }

  async fromAccount() {
    return this.$("#swap-form-from-account input");
  }

  async fromAmount() {
    return this.$("#swap-form-from-amount");
  }

  async arrow() {
    return this.$("#swap-arrow");
  }

  async toCurrency() {
    return this.$("#swap-form-to-currency input");
  }

  async toAccount() {
    return this.$("#swap-form-to-account input");
  }

  async toAmount() {
    return this.$("#swap-form-to-amount");
  }

  async ratesLoader() {
    return this.$("#swap-form-rates-loader");
  }

  async countervalue() {
    return this.$("#swap-form-countervalue");
  }

  async price() {
    return this.$("#swap-form-price");
  }

  async countdown() {
    return this.$("#swap-form-countdown");
  }

  async exchangeButton() {
    return this.$("#swap-form-exchange-button");
  }

  async summaryProviderCheckbox() {
    return this.$("#swap-modal-summary-provider-tos-checkbox");
  }

  async deviceConfirmationStep() {
    return this.$("#swap-modal-device-confirmation");
  }

  async successCloseButton() {
    return this.$("#swap-modal-finished-close-button");
  }

  async summaryConfirmButton() {
    return this.$("#swap-modal-summary-confirm-button");
  }

  async history() {
    return this.$("#swap-history");
  }

  async firstRow() {
    return this.$(".swap-history-row:first-child");
  }
}
