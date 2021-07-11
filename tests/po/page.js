// import {
//   addAnnouncementFromPool,
//   addMockAnnouncement,
//   resetAnnouncements,
// } from "../mocks/notificationsHelpers";
// import { resetIncidents, toggleMockIncident } from "../mocks/serviceStatusHelpers";
import { announcementsApiMock, serviceStatusApiMock } from "../common";

export default class Page {
  constructor(app) {
    this.app = app;
    this.$ = selector => app.client.$(selector);
  }

  async loadingLogo() {
    return this.$("#loading-logo");
  }

  async logo() {
    return this.$("#logo");
  }

  async pageTitle() {
    return this.$("#page-title");
  }

  async pageDescription() {
    return this.$("#page-description");
  }

  async theme() {
    return this.$("#onboarding-container");
  }

  async inputError() {
    return this.$("#input-error");
  }

  async inputWarning() {
    return this.$("#input-warning");
  }

  async drawerCollapseButton() {
    return this.$("#drawer-collapse-button");
  }

  async drawerPortfolioButton() {
    return this.$("#drawer-dashboard-button");
  }

  async drawerAccountsButton() {
    return this.$("#drawer-accounts-button");
  }

  async drawerSendButton() {
    return this.$("#drawer-send-button");
  }

  async drawerReceiveButton() {
    return this.$("#drawer-receive-button");
  }

  async drawerSwapButton() {
    return this.$("#drawer-swap-button");
  }

  async drawerManagerButton() {
    return this.$("#drawer-manager-button");
  }

  async drawerBuycryptoButton() {
    return this.$("#drawer-exchange-button");
  }

  async drawerExperimentalButton() {
    return this.$("#drawer-experimental-button");
  }

  async topbarDiscreetButton() {
    return this.$("#topbar-discreet-button");
  }

  async topbarSynchronizeButton() {
    return this.$("#topbar-synchronize-button");
  }

  async topbarSettingsButton() {
    return this.$("#topbar-settings-button");
  }

  async topbarLockButton() {
    return this.$("#topbar-password-lock-button");
  }

  async bookmarkedAccountsList() {
    return this.$("#bookmarked-accounts");
  }

  async getBookmarkedAccounts() {
    const list = await this.bookmarkedAccountsList();
    const items = await list.$$(".bookmarked-account-item");
    return items;
  }

  async toggleDiscreetMode() {
    const descreetBtn = await this.topbarDiscreetButton();
    await descreetBtn.click();
  }

  // Drawer Menu
  async goToAccounts() {
    const btn = await this.drawerAccountsButton();
    await btn.click();
  }

  async goToPortfolio() {
    const btn = await this.drawerPortfolioButton();
    await btn.click();
  }

  async synchronize() {
    const btn = await this.topbarSynchronizeButton();
    await btn.click();
    await this.app.client.waitForSync();
  }

  async goToBuyCrypto() {
    const buyCryptoBtn = await this.drawerBuycryptoButton();
    await buyCryptoBtn.click();
  }

  async getThemeColor() {
    const bgColor = await this.theme.getCSSProperty("background-color");
    return bgColor.parsed.hex;
  }

  async goToSwap() {
    const btn = await this.drawerSwapButton();
    await btn.click();
  }

  async goToManager() {
    const btn = await this.drawerManagerButton();
    await btn.click();
  }

  // Notifications
  async addAnnouncement() {
    announcementsApiMock("addAnnouncementFromPool");
    await this.synchronize();
  }

  async generateAnnouncement(params) {
    announcementsApiMock("addMockAnnouncement", params);
    await this.synchronize();
  }

  resetAnnouncements() {
    announcementsApiMock("resetAnnouncements");
  }

  // ServiceStatus
  async toggleIncident(bool = true) {
    serviceStatusApiMock("toggleMockIncident", bool);
    await this.synchronize();
  }

  resetIncidents() {
    serviceStatusApiMock("resetIncidents");
  }
}
