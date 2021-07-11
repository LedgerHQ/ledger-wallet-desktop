/* eslint-disable jest/no-export */
import { app, accountsPage, exportAccountsModal } from "../../common.js";

const exportAccountsToMobile = (currency = "global") => {
  describe("export accounts to mobile", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
      await app.client.waitForSync();
    });

    it("opens the export accounts modal", async () => {
      await accountsPage.exportAccountsToMobile();
      expect(await exportAccountsModal.waitForDisplayed()).toBe(true);
    });

    it("displays a QRCode", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-account-to-mobile-modal`,
      });
    });

    it("closes the export accounts modal", async () => {
      await exportAccountsModal.confirm();
      expect(await exportAccountsModal.waitForDisplayed({ reverse: true })).toBe(true);
    });
  });
};

export default exportAccountsToMobile;
