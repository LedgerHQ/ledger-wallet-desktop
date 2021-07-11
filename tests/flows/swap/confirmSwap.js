/* eslint-disable jest/no-export */
import { app, swapPage, modalPage, devicePage, mockDeviceEvent } from "../../common.js";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";

const confirmSwap = () => {
  describe("When I click on exchange button", () => {
    it("should display summary modal", async () => {
      const exchangeButton = await swapPage.exchangeButton();
      await exchangeButton.click();

      expect(await modalPage.waitForDisplayed()).toBe(true);
    });

    it("confirm button should be disable by default", async () => {
      const summaryConfirmButton = await swapPage.summaryConfirmButton();
      expect(await summaryConfirmButton.isEnabled()).toBe(false);
    });

    describe("when I tick the terms checkbox", () => {
      it("confirm button should be enabled", async () => {
        const summaryProviderCheckbox = await swapPage.summaryProviderCheckbox();
        await summaryProviderCheckbox.click();

        const summaryConfirmButton = await swapPage.summaryConfirmButton();
        expect(await summaryConfirmButton.isEnabled()).toBe(true);
      });

      it("form should be valid", async () => {
        expect(await app.client.screenshot()).toMatchImageSnapshot({
          customSnapshotIdentifier: "swap-summary-step",
        });
      });
    });

    describe("when I click on confirm button", () => {
      it("should display the loader", async () => {
        const summaryConfirmButton = await swapPage.summaryConfirmButton();
        await summaryConfirmButton.click();

        const deviceActionLoader = await devicePage.deviceActionLoader();
        expect(await deviceActionLoader.isDisplayed()).toBe(true);
      });

      describe("when I reach device action step", () => {
        it("should display device confirmation step", async () => {
          await mockDeviceEvent({ type: "opened" }, { type: "complete" });
          await mockDeviceEvent({ type: "opened" });
          await mockDeviceEvent({ type: "init-swap-requested" });
          const deviceConfirmationStep = await swapPage.deviceConfirmationStep();
          expect(await deviceConfirmationStep.waitForDisplayed()).toBe(true);
        });

        describe("when I confirm the swap on device", () => {
          it("should display the operation summary", async () => {
            await mockDeviceEvent(
              {
                type: "init-swap-result",
                initSwapResult: {
                  transaction: fromTransactionRaw({
                    family: "bitcoin",
                    recipient: "1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e",
                    amount: "1",
                    feePerByte: "1",
                    networkInfo: {
                      family: "bitcoin",
                      feeItems: {
                        items: [
                          { key: "0", speed: "high", feePerByte: "3" },
                          { key: "1", speed: "standard", feePerByte: "2" },
                          { key: "2", speed: "low", feePerByte: "1" },
                        ],
                        defaultFeePerByte: "1",
                      },
                    },
                    rbf: false,
                    utxoStrategy: {
                      strategy: 0,
                      pickUnconfirmedRBF: false,
                      excludeUTXOs: [],
                    },
                  }),
                  swapId: "12345",
                },
              },
              { type: "complete" },
            );

            // Silent signing, then automatic broadcasting triggered.
            await mockDeviceEvent({ type: "opened" }, { type: "complete" });
            const deviceActionLoader = await devicePage.deviceActionLoader();
            await deviceActionLoader.waitForDisplayed();
            await app.client.waitUntilTextExists(
              "#device-action-loader",
              "Loading... (100%)",
              10000,
            );
            const successCloseButton = await swapPage.successCloseButton();
            await successCloseButton.waitForDisplayed();

            expect(await app.client.screenshot()).toMatchImageSnapshot({
              customSnapshotIdentifier: "swap-end-0",
            });
          });
        });

        describe("when I click on close button", () => {
          it("should close modal", async () => {
            const closeButton = await swapPage.successCloseButton();
            await closeButton.click();

            expect(await modalPage.waitForDisplayed({ reverse: true })).toBe(true);
          });

          it("should land on history page", async () => {
            const history = await swapPage.history();

            expect(await history.waitForDisplayed()).toBe(true);
          });

          it("and look like this", async () => {
            expect(await app.client.screenshot()).toMatchImageSnapshot({
              customSnapshotIdentifier: "swap-end-1",
            });
          });
        });
      });
    });
  });
};

export default confirmSwap;
