/* eslint-disable jest/no-export */
import { app, swapPage, modalPage } from "../../common.js";

const checkSwapHistory = () => {
  describe(`When I access history page`, () => {
    it("should show operation details modal", async () => {
      const firstRow = await swapPage.firstRow();
      await firstRow.waitForDisplayed();
      await firstRow.click();
      await modalPage.waitForDisplayed();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: "swap-history-modal",
      });
    });
  });
};

export default checkSwapHistory;
