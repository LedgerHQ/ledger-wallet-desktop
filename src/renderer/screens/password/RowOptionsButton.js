// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import Track from "~/renderer/analytics/Track";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import Switch from "~/renderer/components/Switch";
import Tooltip from "~/renderer/components/Tooltip";
import IconDots from "~/renderer/icons/Dots";
import IconEye from "~/renderer/icons/Eye";
import IconSend from "~/renderer/icons/Send";
import IconTrash from "~/renderer/icons/Trash";
import { openModal } from "~/renderer/actions/modals";
import { useHideEmptyTokenAccounts } from "~/renderer/actions/settings";

import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Separator: ThemedComponent<{}> = styled.div`
  background-color: ${p => p.theme.colors.palette.divider};
  height: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Item: ThemedComponent<{
  disableHover?: boolean,
}> = styled(DropDownItem)`
  width: 230px;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: flex-start;
  align-items: center;
`;

type ItemType = DropDownItemType & {
  icon?: React$Element<*>,
  onClick?: Function,
  type?: "separator",
};

const OptionsButton = (props) => {
  const dispatch = useDispatch();
  const [hideEmptyTokenAccounts, setHideEmptyTokenAccounts] = useHideEmptyTokenAccounts();

  const onOpenModal = useCallback(
    (modal: string) => {
      dispatch(openModal(modal));
    },
    [dispatch],
  );
  const { t } = useTranslation();

  const items: DropDownItemType[] = [
    {
      key: "showPassword",
      label: t("llpassword.optionsRow.showPassword"),
      icon: <IconEye size={16} />,
      onClick: () => props.onShow(),
    },
    {
      key: "deletePassword",
      label: t("llpassword.optionsRow.deletePassword"),
      icon: <IconTrash size={16} />,
      onClick: () => props.onRemove(),
    }
  ];

  const renderItem = ({ item }: { item: ItemType }) => {
    if (item.type === "separator") {
      return <Separator />;
    }

    return (
      <Item horizontal flow={2} onClick={item.onClick}>
        <Box mr={4}>{item.icon}</Box>
        {item.label}
      </Item>
    );
  };

  return (
    <DropDownSelector horizontal items={items} renderItem={renderItem}>
      {() => (
        <Box horizontal>
          <Tooltip content={t("accounts.optionsMenu.title")}>
            <Button
              small
              outlineGrey
              flow={1}
              style={{ width: 34, padding: 0, justifyContent: "center" }}
            >
              <Box alignItems="center">
                <IconDots size={14} />
              </Box>
            </Button>
          </Tooltip>
        </Box>
      )}
    </DropDownSelector>
  );
};

export default React.memo<{}>(OptionsButton);