/* eslint-disable jest/no-export */
import { app, accountsPage, accountPage, drawerPage } from "../../common.js";

const showOperations = (currency = "global") => {
  describe("account operations list", () => {
    beforeAll(async () => {
      await accountsPage.goToAccounts();
      await app.client.waitForSync();
    });

    afterAll(async () => {
      await modalPage.close();
      await modalPage.waitForDisplayed({ reverse: true });
    });

    it("show the first account", async () => {
      await accountsPage.searchAccount(currency);
      const firstAccountRow = await accountsPage.getFirstAccountRow();
      await firstAccountRow.click();

      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-operation-list`,
      });
    });
    it("show the first operation", async () => {
      await accountPage.clickFirstOperationRow();

      await drawerPage.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `${currency}-account-operation-details`,
      });
    });
  });
};

export default showOperations;
