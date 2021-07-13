// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
import { Card } from "~/renderer/components/Box";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";

type Props = {
  match: {
    params: {
      appId: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
};

export default function PlatformApp({ match }: Props) {
  const history = useHistory();
  const { appId } = match.params;
  const { manifestById } = usePlatformApp();
  const manifest = manifestById[appId];

  const handleClose = useCallback(() => history.push(`/platform`), [history]);

  // TODO for next urlscheme evolutions:
  // - check if local settings allow to launch an app from this branch, else display an error
  // - check if the app is available in store, else display a loader if apps are getting fetched from remote, else display an error stating that the app doesn't exist

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <TrackPage category="Platform" name="App" appId={appId} />
      {manifest ? <WebPlatformPlayer manifest={manifest} onClose={handleClose} /> : null}
    </Card>
  );
}
