/* eslint-disable jest/no-export */
import { app, exportOperationsHistoryModal, accountsPage } from "../../common.js";

const exportOperationsHistory = (currency = "global") => {
  describe("exports the operations history", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
      await app.client.waitForSync();
    });

    it("opens the export operations history modal", async () => {
      await accountsPage.exportOperationsHistory();
      expect(await exportOperationsHistoryModal.waitForDisplayed()).toBe(true);
    });

    it("displays a list of accounts", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-operations-history-modal-open`,
        // https://github.com/LedgerHQ/ledger-live-desktop/pull/3546#issuecomment-774141490
        failureThreshold: 1,
        failureThresholdType: "pixel",
      });
    });

    it("save button should be disabled", async () => {
      const saveButton = await accountsPage.exportOperationsHistorySaveButton();
      expect(await saveButton.isClickable()).toBe(false);
    });

    it("selects the first two accounts", async () => {
      const accounts = await exportOperationsHistoryModal.getAccountsRows();
      const firstAccount = accounts[0];
      const secondAccount = accounts[1];

      await firstAccount.click();
      await secondAccount.click();

      const firstInput = await firstAccount.$("input");
      const secondInput = await secondAccount.$("input");

      expect(await firstInput.isSelected()).toBe(true);
      expect(await secondInput.isSelected()).toBe(true);
    });

    it("save button should be enabled", async () => {
      const saveButton = await accountsPage.exportOperationsHistorySaveButton();
      expect(await saveButton.isClickable()).toBe(true);
    });

    it("displays a list with first two accounts selected", async () => {
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-export-operations-history-modal-accounts-selected`,
      });
    });

    it("closes the export operations history modal", async () => {
      await exportOperationsHistoryModal.close();
      expect(await exportOperationsHistoryModal.waitForDisplayed({ reverse: true })).toBe(true);
    });
  });
};

export default exportOperationsHistory;
