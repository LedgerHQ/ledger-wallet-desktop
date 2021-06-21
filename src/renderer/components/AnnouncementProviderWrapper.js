// @flow
import React, { useCallback, useMemo } from "react";
import { AnnouncementProvider } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import type { Announcement } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/types";
import { getKey, setKey } from "~/renderer/storage";
import { languageSelector } from "~/renderer/reducers/settings";
import { currenciesIdSelector } from "~/renderer/reducers/accounts";
import { useSelector, useDispatch } from "react-redux";
import { ServiceStatusProvider } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider/index";
import { openInformationCenter } from "~/renderer/actions/UI";
import { track } from "~/renderer/analytics/segment";

type Props = {
  children: React$Node,
};

async function saveAnnouncements({
  announcements,
  seenIds,
  lastUpdateTime,
}: {
  announcements: Announcement[],
  seenIds: string[],
  lastUpdateTime: number,
}) {
  setKey("app", "announcements", {
    announcements,
    seenIds,
    lastUpdateTime,
  });
}

async function loadAnnouncements(): Promise<{
  announcements: Announcement[],
  seenIds: string[],
  lastUpdateTime: number,
}> {
  const data = await getKey("app", "announcements", {
    announcements: [],
    seenIds: [],
    lastUpdateTime: new Date().getTime(),
  });
  return data;
}

export function AnnouncementProviderWrapper({ children }: Props) {
  const startDate = useMemo(() => new Date(), []);
  const language = useSelector(languageSelector);
  const currencies = useSelector(currenciesIdSelector);
  const dispatch = useDispatch();

  // $FlowFixMe please help on fixing this. bad type on live-common?
  const { pushToast, dismissToast } = useToasts();

  const context = {
    language,
    currencies,
    getDate: () => new Date(),
  };

  const onNewAnnouncement = useCallback(
    (announcement: Announcement) => {
      // eslint-disable-next-line camelcase
      const { uuid, content, icon, utm_campaign, published_at } = announcement;

      track("Announcement Received", {
        uuid,
        utm_campaign,
      });

      if (new Date(published_at) > startDate) {
        pushToast({
          id: uuid,
          type: "announcement",
          title: content.title,
          text: content.text,
          icon,
          callback: () => dispatch(openInformationCenter("announcement")),
        });
      }
    },
    [pushToast, dispatch, startDate],
  );

  const onAnnouncementRead = useCallback(
    (announcement: Announcement) => {
      // eslint-disable-next-line camelcase
      const { uuid, utm_campaign } = announcement;

      track("Announcement Viewed", {
        uuid,
        utm_campaign,
      });

      dismissToast(uuid);
    },
    [dismissToast],
  );

  return (
    <AnnouncementProvider
      autoUpdateDelay={60000}
      context={context}
      onNewAnnouncement={onNewAnnouncement}
      onAnnouncementRead={onAnnouncementRead}
      handleLoad={loadAnnouncements}
      handleSave={saveAnnouncements}
    >
      <ServiceStatusProvider context={{ currencies }} autoUpdateDelay={60000}>
        {children}
      </ServiceStatusProvider>
    </AnnouncementProvider>
  );
}
