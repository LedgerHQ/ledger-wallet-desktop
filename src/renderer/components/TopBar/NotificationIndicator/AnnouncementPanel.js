// @flow
import React, { useCallback, useRef, useMemo, useState } from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";
import { InView } from "react-intersection-observer";

import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { groupAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/helpers";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import InfoCircle from "~/renderer/icons/InfoCircle";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedDate from "../../FormattedDate";
import { useDeepLinkHandler } from "~/renderer/hooks/useDeeplinking";
import { useDispatch } from "react-redux";
import { closeInformationCenter } from "~/renderer/actions/UI";

const DateRowContainer = styled.div`
  padding: 4px 16px;
  background-color: ${({ theme }) => theme.colors.palette.background.default};
  border-radius: 4px;
  margin: 25px 0px;
`;

const levelThemes = {
  info: {
    title: "palette.text.shade100",
    text: "palette.text.shade50",
    background: undefined,
    icon: undefined,
    link: undefined,
    padding: undefined,
  },
  warning: {
    title: "white",
    text: "white",
    background: "orange",
    icon: "white",
    link: "white",
    padding: "16px",
  },
  alert: {
    title: "palette.text.shade100",
    text: "palette.text.shade50",
    background: "red",
    icon: "white",
    link: "white",
    padding: undefined,
  },
};

const getLevelTheme = (levelName: string) => {
  const levelData = levelThemes[levelName];

  if (levelData) {
    return levelData;
  }
  return levelThemes.info;
};

const UnReadNotifBadge = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${p => p.theme.colors.wallet};
  border-radius: 8px;
  position: absolute;
  top: calc(50% - 4px);
  left: 0px;
  z-index: 1;
`;

type DateRowProps = {
  date: Date,
};

function DateRow({ date }: DateRowProps) {
  return (
    <DateRowContainer>
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize="11px" lineHeight="18px">
        <FormattedDate date={date} format="MMMM, Do, YYYY" />
      </Text>
    </DateRowContainer>
  );
}

const ArticleRootContainer = styled.div`
  padding-left: ${p => (p.isRead ? 0 : 16)}px;
  position: relative;
`;

const ArticleContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  border-radius: 4px;
`;

const ArticleRightColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
type ArticleProps = {
  level: string,
  icon: string,
  title: string,
  text: string,
  link?: {
    label?: string,
    href: string,
  },
  utmCampaign?: string,
  isRead?: boolean,
};

const icons = {
  warning: {
    defaultIconColor: "orange",
    Icon: TriangleWarning,
  },
  info: {
    defaultIconColor: "wallet",
    Icon: InfoCircle,
  },
};

const getIcon = (iconName: string) => {
  const iconData = icons[iconName];

  if (iconData) {
    return iconData;
  }
  return icons.info;
};

type ArticleLinkProps = {
  label?: string,
  href: string,
  utmCampaign?: string,
  color?: string,
};

function ArticleLink({ label, href, utmCampaign, color }: ArticleLinkProps) {
  const { handler } = useDeepLinkHandler();
  const dispatch = useDispatch();
  const url = useMemo(() => {
    const url = new URL(href);
    url.searchParams.set("utm_medium", "announcement");

    if (utmCampaign) {
      url.searchParams.set("utm_campaign", utmCampaign);
    }
    return url;
  }, [href, utmCampaign]);

  const onLinkClick = useCallback(() => {
    const isDeepLink = url.protocol === "ledgerlive:";

    if (isDeepLink) {
      handler(null, url.href);
      dispatch(closeInformationCenter());
    } else openURL(url.href);
  }, [url, handler, dispatch]);

  return (
    <LinkWithExternalIcon
      color={color}
      onClick={onLinkClick}
      style={{
        marginTop: 15,
      }}
    >
      {label || href}
    </LinkWithExternalIcon>
  );
}

function Article({
  level = "info",
  icon = "info",
  title,
  text,
  link,
  utmCampaign,
  isRead,
}: ArticleProps) {
  const [isSeen] = useState(isRead);

  const levelTheme = getLevelTheme(level);
  const { Icon, defaultIconColor } = getIcon(icon);

  return (
    <ArticleRootContainer isRead={isSeen}>
      <ArticleContainer
        bg={levelTheme.background}
        py={levelTheme.padding}
        px="16px"
        color={levelTheme.icon || defaultIconColor}
      >
        <ArticleRightColumnContainer>
          <Box horizontal alignItems="center" justifyContent="center">
            <Icon size={15} />
            <Box ml={2} flex="1">
              <Text
                color={levelTheme.title}
                ff="Inter|SemiBold"
                fontSize="14px"
                lineHeight="16.94px"
              >
                {title}
              </Text>
            </Box>
          </Box>

          <Text
            mt="4px"
            color={levelTheme.text}
            ff="Inter|Medium"
            fontSize="12px"
            lineHeight="18px"
          >
            {text}
          </Text>
          {link ? (
            <ArticleLink
              href={link.href}
              label={link.label}
              utmCampaign={utmCampaign}
              color={levelTheme.link}
            />
          ) : null}
        </ArticleRightColumnContainer>
      </ArticleContainer>
      {isSeen ? null : <UnReadNotifBadge />}
    </ArticleRootContainer>
  );
}

const PanelContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Separator = styled.div`
  margin: 25px 0px;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.palette.text.shade10};
`;

export function AnnouncementPanel() {
  const { cache, setAsSeen, seenIds, allIds } = useAnnouncements();
  const groupedAnnouncements = useMemo(() => groupAnnouncements(allIds.map(uuid => cache[uuid])), [
    cache,
    allIds,
  ]);

  const timeoutByUUID = useRef({});
  const handleInView = useCallback(
    (visible, uuid) => {
      const timeouts = timeoutByUUID.current;
      if (!seenIds.includes(uuid) && visible && !timeouts[uuid]) {
        timeouts[uuid] = setTimeout(() => {
          setAsSeen(uuid);
          delete timeouts[uuid];
        }, 1000);
      }

      if (!visible && timeouts[uuid]) {
        clearTimeout(timeouts[uuid]);
        delete timeouts[uuid];
      }
    },
    [seenIds, setAsSeen],
  );

  if (!groupedAnnouncements.length) {
    return (
      <PanelContainer>
        <Text
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="18px"
          lineHeight="21.78px"
          textAlign="center"
        >
          <Trans i18nKey="informationCenter.announcement.emptyState.title" />
        </Text>
        <Text
          mt="8px"
          color="palette.text.shade50"
          ff="Inter|Regular"
          fontSize="13px"
          lineHeight="15.73px"
          textAlign="center"
        >
          <Trans i18nKey="informationCenter.announcement.emptyState.desc" />
        </Text>
      </PanelContainer>
    );
  }

  return (
    <ScrollArea hideScrollbar>
      <Box py="32px">
        {groupedAnnouncements.map((group, index) => (
          <React.Fragment key={index}>
            {group.day ? <DateRow date={group.day} /> : null}
            {// $FlowFixMe
            group.data.map(({ level, icon, content, uuid, utm_campaign: utmCampaign }, index) => (
              <React.Fragment key={uuid}>
                <InView as="div" onChange={visible => handleInView(visible, uuid)}>
                  <Article
                    level={level}
                    icon={icon}
                    title={content.title}
                    text={content.text}
                    link={content.link}
                    uuid={uuid}
                    utmCampaign={utmCampaign}
                    isRead={seenIds.includes(uuid)}
                  />
                </InView>
                {index < group.data.length - 1 ? <Separator /> : null}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </ScrollArea>
  );
}
