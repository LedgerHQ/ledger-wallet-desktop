/* eslint-disable jest/no-export */
import initialize, { app, deviceInfo, mockListAppsResult, mockDeviceEvent } from "../../common.js";

const $ = selector => app.client.$(selector);

export const selection = device => {
  it("go through start", async () => {
    const imgLoaded = await $(".onboarding-imgs-loaded");
    await imgLoaded.waitForDisplayed();

    const elem = await $("#onboarding-get-started-button");
    await elem.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-terms-" + device,
    });
  });
  it("accept terms", async () => {
    const termsCheck = await $("#onboarding-terms-check");
    const termsSubmit = await $("#onboarding-terms-submit");

    await termsCheck.click();
    await termsSubmit.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-terms-accepted-" + device,
    });
  });
  it("selects " + device, async () => {
    const nanoX = await $("#device-" + device);
    await nanoX.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: `onboarding-${device}-flow-` + device,
    });
  });
};

export const goToConnectAndFinish = (cta, device) => {
  it("goes to connect", async () => {
    const next = await $(cta);
    await next.click();
    await app.client.pause(500);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      // wave thing
      failureThreshold: 15,
      failureThresholdType: "pixel",
      // its the same but for some reason theres a button that's not the same (?)
      customSnapshotIdentifier: "onboarding-genuine-check-" + cta.replace("#", "") + "-" + device,
    });
  });

  it("check nano", async () => {
    const next = await $("#pair-my-nano-cta");
    await next.click();
    await app.client.pause(2000);
    await mockDeviceEvent(
      {
        type: "listingApps",
        deviceInfo,
      },
      {
        type: "result",
        result: mockListAppsResult("Bitcoin", "Bitcoin", deviceInfo),
      },
      { type: "complete" },
    );
    await app.client.pause(5000);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      // wave thing
      failureThreshold: 15,
      failureThresholdType: "pixel",
      customSnapshotIdentifier: "onboarding-check-complete-" + cta.replace("#", "") + "-" + device,
    });
  });

  it("should be on app", async () => {
    const next = await $("#genuine-check-cta");
    await next.click();
    await app.client.pause(200);
    expect(await app.client.screenshot()).toMatchImageSnapshot({
      customSnapshotIdentifier: "onboarding-complete-" + cta.replace("#", "") + "-" + device,
    });
  });
};

export const onboard = device => {
  describe(`onboarding ${device} - new nano`, () => {
    initialize("onboarding", {});

    selection(device);

    it("goes through the tutorial", async () => {
      const firstUse = await $("#first-use");
      await firstUse.click();
      const right = await $("#pedagogy-right");
      await right.click();
      await app.client.pause(200);
      await right.click();
      await app.client.pause(200);
      await right.click();
      await app.client.pause(200);
      await right.click();
      await app.client.pause(200);
      const cta = await $("#setup-nano-wallet-cta");
      await cta.click();
      await app.client.pause(700);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-getstarted-" + device,
      });
    });

    it("gets started", async () => {
      const next = await $("#get-started-cta");
      await next.click();
      const carefulcta = await $("#be-careful-cta");
      carefulcta.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-getstarted-2-" + device,
      });
    });

    it("goes to pincode", async () => {
      const next = await $("#device-howto-cta");
      await next.click();
      await app.client.waitForIllustration();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-pincode-" + device,
      });
    });

    it("goes to pincode 2", async () => {
      const pincodeCB = await $("#pincode-private-cb");
      pincodeCB.click();
      const next = await $("#device-pincode-cta");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-pincode-2-" + device,
      });
    });

    it("goes to recovery phrase", async () => {
      const next = await $("#pincode-howto-cta");
      await next.click();
      await app.client.waitForIllustration();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-" + device,
      });
    });

    it("goes to recovery phrase 2", async () => {
      const recoveryphraseCB = await $("#recoveryphrase-private-cb");
      recoveryphraseCB.click();
      const next = await $("#device-recoveryphrase-cta");
      await next.click();
      await app.client.pause(1000);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-2-" + device,
      });
    });

    it("goes to recovery phrase 3", async () => {
      const next = await $("#use-recovery-sheet");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-3-" + device,
      });
    });

    it("goes to recovery phrase 4", async () => {
      const next = await $("#recovery-howto-3");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-4-" + device,
      });
    });

    it("goes to quizz", async () => {
      const next = await $("#hide-recovery-cta");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-quizz-" + device,
      });
    });

    it("finished the quizz", async () => {
      let next = await $("#quizz-start-cta");
      await next.click();
      await app.client.pause(200);
      next = await $("#answer-1");
      await next.click();
      await app.client.pause(200);
      next = await $("#quizz-next-cta");
      await next.click();
      await app.client.pause(200);
      next = await $("#answer-1");
      await next.click();
      await app.client.pause(200);
      next = await $("#quizz-next-cta");
      await next.click();
      await app.client.pause(200);
      next = await $("#answer-0");
      await next.click();
      await app.client.pause(200);
      next = await $("#quizz-next-cta");
      await next.click();
      await app.client.waitForIllustration();
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-you-are-a-pro-" + device,
      });
    });

    goToConnectAndFinish("#quizz-success-cta", device);
  });

  describe(`onboarding ${device} - connect`, () => {
    initialize("onboarding", {});

    selection(device);

    goToConnectAndFinish("#initialized-device", device);
  });

  describe(`onboarding ${device} - restore`, () => {
    initialize("onboarding", {});

    selection(device);

    it("goes to restore 1", async () => {
      const next = await $("#restore-device");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-start-" + device,
      });
    });

    it("warns the user", async () => {
      const next = await $("#import-recovery-next");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-warn-" + device,
      });
    });

    it("does recovery 1", async () => {
      const next = await $("#ledger-seed-warn");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-restore-step1-" + device,
      });
    });

    it("goes to pincode", async () => {
      const next = await $("#device-howto-2");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-restore-pincode-" + device,
      });
    });

    it("goes to pincode 2", async () => {
      const pincodeCB = await $("#pincode-private-cb");
      pincodeCB.click();
      const next = await $("#device-pincode-cta");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-restore-pincode-2-" + device,
      });
    });

    it("goes to recovery phrase restore", async () => {
      const next = await $("#pincode-howto-cta");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore-" + device,
      });
    });

    it("goes to recovery phrase restore 2", async () => {
      const recoveryphraseCB = await $("#passphrase-recovery-cb");
      recoveryphraseCB.click();
      const next = await $("#passphrase-recovery-cta");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore-2-" + device,
      });
    });

    it("goes to recovery phrase restore 3", async () => {
      const next = await $("#recovery-howto-1");
      await next.click();
      await app.client.pause(500);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        // wave thing
        failureThreshold: 15,
        failureThresholdType: "pixel",
        customSnapshotIdentifier: "onboarding-nano-recoveryphrase-restore-3-" + device,
      });
    });

    goToConnectAndFinish("#recovery-howto-2", device);
  });
};
