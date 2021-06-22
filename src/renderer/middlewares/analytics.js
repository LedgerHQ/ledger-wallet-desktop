// @flow

import { hasCompletedOnboardingSelector } from "~/renderer/reducers/settings";
import { start, track } from "~/renderer/analytics/segment";
import type { State } from "~/renderer/reducers";

let isAnalyticsStarted = false;

export default ({ migration }: { migration?: any }) => (store: *) => (next: *) => (action: *) => {
  next(action);
  const state: State = store.getState();
  const hasCompletedOnboarding = hasCompletedOnboardingSelector(state);

  if (hasCompletedOnboarding && !isAnalyticsStarted) {
    isAnalyticsStarted = true;
    start(store);

    if (Object.keys(migration || {}).length) {
      track("migration-event", migration);
    }
  }
};
