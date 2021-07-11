import initialize, {
  app,
  mockDeviceEvent,
  modalPage,
  addAccountsModal,
  receiveModal,
} from "../../common.js";

describe("sub accounts", () => {
  initialize("sub-accounts", {
    userData: "onboardingcompleted",
  });

  describe("When parent is missing", () => {
    afterAll(async () => {
      await modalPage.close();
      await modalPage.waitForDisplayed({ reverse: true });
    });
    it("should find token in the currencies list", async () => {
      await addAccountsModal.goToAddAccount();
      await addAccountsModal.prepareAddAccount("chainlink");
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-chainlink-no-parent`,
      });
    });
    it("should add parent", async () => {
      await addAccountsModal.finishAddAccount(mockDeviceEvent);
      const addAccountSuccessTitle = await addAccountsModal.addAccountSuccessTitle();
      expect(await addAccountSuccessTitle.getText()).toBe("Accounts added successfully");
    });
  });

  describe("When parent present but subaccount missing", () => {
    afterAll(async () => {
      await modalPage.close();
      await modalPage.waitForDisplayed({ reverse: true })();
    });
    it("should find token in the currencies list", async () => {
      await addAccountsModal.goToAddAccount();
      await addAccountsModal.prepareAddAccount("must");
      const currencyBadge = await addAccountsModal.currencyBadge();
      await currencyBadge.waitForDisplayed();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-must-no-parent`,
      });
    });
    it("should receive on parent", async () => {
      const continueBtn = await addAccountsModal.addParentAccountContinueButton();
      await continueBtn.click();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-receive-on-parent-1`,
      });
    });
    it("should show parent address", async () => {
      await receiveModal.receiveSkipDevice();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-receive-on-parent-2`,
      });
    });
  });

  describe("When parent and subAccount present", () => {
    it("should receive on subaccount", async () => {
      await addAccountsModal.goToAddAccount();
      await addAccountsModal.prepareAddAccount("tether");
      const currencyBadge = await addAccountsModal.currencyBadge();
      await currencyBadge.waitForDisplayed();
      const continueBtn = await addAccountsModal.addParentAccountContinueButton();
      await continueBtn.click();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-receive-on-subaccount-1`,
      });
    });
    it("should show subaccount address", async () => {
      await receiveModal.receiveSkipDevice();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `addAccount-receive-on-subaccount-2`,
      });
    });
  });
});
