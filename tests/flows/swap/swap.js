/* eslint-disable jest/no-export */
import { app, swapPage } from "../../common.js";

const swap = o => {
  describe("When I reach the swap form", () => {
    it("should display an empty form", async () => {
      const form = await swapPage.form();
      await form.waitForDisplayed();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "swap-empty-form",
      });
    });

    // FIXME: tooltip element identification issue
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("should not display rate information tooltip", async () => {
      const tradeMethodTooltip = await swapPage.tradeMethodTooltip();
      expect(await tradeMethodTooltip.isDisplayed()).toBe(false);
    });

    // FIXME: mouse over issue on tooltip
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip("when I hover the rate information button", () => {
      it("should display rate information tooltip", async () => {
        const tradeMethodInfo = await swapPage.tradeMethodInfo();
        await tradeMethodInfo.moveTo(); // Doesn't hover the right element
        const tradeMethodTooltip = await swapPage.tradeMethodTooltip();
        await tradeMethodTooltip.waitForDisplayed();
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-rates-tooltip",
        });
      });
    });

    describe("when I choose a crypto asset source", () => {
      it("should autofill the source account", async () => {
        const fromCurrencyInput = await swapPage.fromCurrency();
        await fromCurrencyInput.setValue(o.fromCurrency);
        await app.client.keys(["Enter"]);
        expect(await fromCurrencyInput.getValue()).toBeDefined();
      });

      it("trade method button should be disabled", async () => {
        const tradeMethod = await swapPage.tradeMethod();
        expect(await tradeMethod.getAttribute("disabled")).toBe("true");
      });

      it("flip arrow should be disabled", async () => {
        const arrow = await swapPage.arrow();
        expect(await arrow.getAttribute("disabled")).toBe("true");
      });
    });

    describe("when I choose the crypto asset destination", () => {
      it("should autofill the destination account", async () => {
        const toCurrencyInput = await swapPage.toCurrency();
        await toCurrencyInput.setValue(o.toCurrency);
        await app.client.keys(["Enter"]);
        expect(await toCurrencyInput.getValue()).toBeDefined();
      });

      it("I can select another destination account", async () => {
        const toAccountInput = await swapPage.toAccount();
        await toAccountInput.setValue(o.toAccount);
        await app.client.keys(["Enter"]);
        expect(await toAccountInput.getValue()).toBeDefined();
      });

      it("trade method button should be enabled", async () => {
        const tradeMethod = await swapPage.tradeMethod();
        expect(await tradeMethod.getAttribute("disabled")).toBeNull();
      });

      it('trade method should be "fixed" by default', async () => {
        const tradeMethodFixed = await swapPage.tradeMethodFixed();
        expect(await tradeMethodFixed.getAttribute("selected")).toBe("true");
      });

      it("flip arrow should be enabled", async () => {
        const arrow = await swapPage.arrow();
        expect(await arrow.getAttribute("disabled")).toBeNull();
      });

      it("exchange button should be enabled", async () => {
        const exchangeButton = await swapPage.exchangeButton();
        expect(await exchangeButton.isEnabled()).toBe(false);
      });
    });

    describe("when I click on the arrow", () => {
      it("should flip the form", async () => {
        const arrow = await swapPage.arrow();
        await arrow.click();
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-form-flip",
        });
      });

      it("should reset amount fields", async () => {
        const fromAmount = await swapPage.fromAmount();
        const toAmount = await swapPage.toAmount();
        expect(await fromAmount.getValue()).toBe("");
        expect(await toAmount.getValue()).toBe("");
      });

      it("should flip back the form", async () => {
        const arrow = await swapPage.arrow();
        await arrow.click();
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-form-flip-back",
        });
      });
    });

    describe("when I fill the amount field", () => {
      it("should refresh the rates", async () => {
        const fromAmount = await swapPage.fromAmount();
        await fromAmount.setValue([o.fromAmount, "Tab"]);
        const ratesLoader = await swapPage.ratesLoader();
        expect(await ratesLoader.isDisplayed()).toBe(true);
        expect(await ratesLoader.isDisplayed({ reverse: true })).toBe(true);
      });

      it("exchange button should be enabled", async () => {
        const exchangeButton = await swapPage.exchangeButton();
        expect(await exchangeButton.waitForEnabled()).toBe(true);
      });

      it("should display the amount to receive", async () => {
        const toAmount = await swapPage.toAmount();
        expect(await toAmount.getValue()).toBe(o.toAmount);
      });

      it("form should be valid", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-rates",
        });
      });

      it("should display the countervalue", async () => {
        const countervalue = await swapPage.countervalue();
        expect(await countervalue.isDisplayed()).toBe(true);
      });

      it("should display the price", async () => {
        const price = await swapPage.price();
        expect(await price.isDisplayed()).toBe(true);
      });

      it("should display the countdown", async () => {
        const countdown = await swapPage.countdown();
        expect(await countdown.getText()).toBe("01:00");
        expect(await countdown.isDisplayed()).toBe(true);
      });
    });

    describe("when I tick floating rate", () => {
      it('"fixed" trade method should be selected', async () => {
        const tradeMethodFloat = await swapPage.tradeMethodFloat();
        await tradeMethodFloat.click();
        expect(await tradeMethodFloat.getAttribute("selected")).toBe("true");
      });

      it("should refresh the rates", async () => {
        const ratesLoader = await swapPage.ratesLoader();
        expect(await ratesLoader.isDisplayed()).toBe(true);
        expect(await ratesLoader.isDisplayed({ reverse: true })).toBe(true);
      });

      it("exchange button should be enabled", async () => {
        const exchangeButton = await swapPage.exchangeButton();
        expect(await exchangeButton.waitForEnabled()).toBe(true);
      });

      it("should display the amount to receive", async () => {
        const toAmount = await swapPage.toAmount();
        expect(await toAmount.getValue()).toBe(o.toAmount);
      });

      it("should display the countervalue", async () => {
        const countervalue = await swapPage.countervalue();
        expect(await countervalue.isDisplayed()).toBe(true);
      });

      it("should display the price", async () => {
        const price = await swapPage.price();
        expect(await price.isDisplayed()).toBe(true);
      });

      it("should NOT display the countdown", async () => {
        const countdown = await swapPage.countdown();
        expect(await countdown.waitForDisplayed({ reverse: true })).toBe(true);
      });

      it("and look like this", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-float-rates",
        });
      });
    });

    describe("when I tick fixed rate", () => {
      it('"fixed" trade method should be selected', async () => {
        const tradeMethodFixed = await swapPage.tradeMethodFixed();
        await tradeMethodFixed.click();
        expect(await tradeMethodFixed.getAttribute("selected")).toBe("true");
      });

      it("should refresh the rates", async () => {
        const ratesLoader = await swapPage.ratesLoader();
        expect(await ratesLoader.isDisplayed()).toBe(true);
        expect(await ratesLoader.isDisplayed({ reverse: true })).toBe(true);
      });

      it("exchange button should be enabled", async () => {
        const exchangeButton = await swapPage.exchangeButton();
        expect(await exchangeButton.waitForEnabled()).toBe(true);
      });

      it("should display the amount to receive", async () => {
        const toAmount = await swapPage.toAmount();
        expect(await toAmount.getValue()).toBe(o.toAmount);
      });

      it("should display the countervalue", async () => {
        const countervalue = await swapPage.countervalue();
        expect(await countervalue.isDisplayed()).toBe(true);
      });

      it("should display the price", async () => {
        const price = await swapPage.price();
        expect(await price.isDisplayed()).toBe(true);
      });

      it("should display the countdown", async () => {
        const countdown = await swapPage.countdown();
        expect(await countdown.getText()).toBe("01:00");
        expect(await countdown.isDisplayed()).toBe(true);
      });

      it("and look like this", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-fixed-rates",
        });
      });
    });
  });
};

export default swap;
