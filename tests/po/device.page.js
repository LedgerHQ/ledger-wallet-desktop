import Page from "./page";

export default class devicePage extends Page {
  async deviceActionLoader() {
    return this.$("#device-action-loader");
  }
}
