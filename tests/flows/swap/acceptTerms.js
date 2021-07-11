/* eslint-disable jest/no-export */
import { app, swapPage, mockDeviceEvent, deviceInfo, mockListAppsResult } from "../../common.js";

const acceptTerms = () => {
  describe(`When I access swap page`, () => {
    it("should display KYC terms", async () => {
      await swapPage.goToSwap();
      await swapPage.goToChangelly();
      await mockDeviceEvent(
        {
          type: "listingApps",
          deviceInfo,
        },
        {
          type: "result",
          result: mockListAppsResult(
            "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar,Exchange",
            "Exchange,Tron,Bitcoin,Ethereum",
            deviceInfo,
          ),
        },
        { type: "complete" },
      );
      await app.client.waitForSync();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "swap-access",
      });
    });

    it("continue button should be disabled by default", async () => {
      const KYCContinueButton = await swapPage.KYCContinueButton();
      expect(await KYCContinueButton.isEnabled()).toBe(false);
    });

    describe("when I tick the checkbox", () => {
      it("continue button should be enabled", async () => {
        const KYCCheckbox = await swapPage.KYCCheckbox();
        await KYCCheckbox.click();

        const KYCContinueButton = await swapPage.KYCContinueButton();
        expect(await KYCContinueButton.isEnabled()).toBe(true);
      });
    });

    describe("when I click on continue button", () => {
      it("should display the swap form", async () => {
        const KYCContinueButton = await swapPage.KYCContinueButton();
        await KYCContinueButton.click();

        const form = await swapPage.form();
        await form.waitForDisplayed();

        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-kyc-done",
        });
      });
    });
  });
};

export default acceptTerms;
