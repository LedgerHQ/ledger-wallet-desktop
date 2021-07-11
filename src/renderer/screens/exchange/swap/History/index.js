// @flow

import { remote, ipcRenderer } from "electron";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Trans } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Card from "~/renderer/components/Box/Card";
import { accountsSelector } from "~/renderer/reducers/accounts";
import OperationRow from "~/renderer/screens/exchange/swap/History/OperationRow";
import TrackPage from "~/renderer/analytics/TrackPage";
import { operationStatusList } from "@ledgerhq/live-common/lib/exchange/swap";
import getCompleteSwapHistory from "@ledgerhq/live-common/lib/exchange/swap/getCompleteSwapHistory";
import updateAccountSwapStatus from "@ledgerhq/live-common/lib/exchange/swap/updateAccountSwapStatus";
import type { SwapHistorySection } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { flattenAccounts } from "@ledgerhq/live-common/lib/account";
import { mappedSwapOperationsToCSV } from "@ledgerhq/live-common/lib/exchange/swap/csvExport";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import useInterval from "~/renderer/hooks/useInterval";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";
import SectionTitle from "~/renderer/components/OperationsList/SectionTitle";
import { FakeLink } from "~/renderer/components/Link";
import moment from "moment";
import BigSpinner from "~/renderer/components/BigSpinner";
import styled from "styled-components";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import { setDrawer } from "~/renderer/drawers/Provider";
import SwapOperationDetails from "~/renderer/drawers/SwapOperationDetails";

const Head = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`;

const ExportOperationsWrapper = styled(Box)`
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  margin-top: -40px;
  z-index: 10;
`;

const exportOperations = async (
  path: { canceled: boolean, filePath: string },
  csv: string,
  callback?: () => void,
) => {
  try {
    const res = await ipcRenderer.invoke("export-operations", path, csv);
    if (res && callback) {
      callback();
    }
  } catch (error) {}
};

const History = () => {
  const accounts = useSelector(accountsSelector);
  const [exporting, setExporting] = useState(false);
  const [mappedSwapOperations, setMappedSwapOperations] = useState<?(SwapHistorySection[])>(null);
  const dispatch = useDispatch();

  const onExportOperations = useCallback(() => {
    async function asyncExport() {
      const path = await remote.dialog.showSaveDialog({
        title: "Exported swap history",
        defaultPath: `ledgerlive-swap-history-${moment().format("YYYY.MM.DD")}.csv`,
        filters: [
          {
            name: "All Files",
            extensions: ["csv"],
          },
        ],
      });

      if (path && mappedSwapOperations) {
        exportOperations(path, mappedSwapOperationsToCSV(mappedSwapOperations), () =>
          setExporting(false),
        );
      }
    }
    if (!exporting) {
      asyncExport()
        .catch(e => {
          console.log({ e });
        })
        .then(() => {
          setExporting(false);
        });
    }
  }, [exporting, mappedSwapOperations]);

  useEffect(() => {
    (async function asyncGetCompleteSwapHistory() {
      if (!accounts) return;
      const sections = await getCompleteSwapHistory(flattenAccounts(accounts));
      setMappedSwapOperations(sections);
    })();
  }, [accounts]);

  const updateSwapStatus = useCallback(() => {
    let cancelled = false;
    async function fetchUpdatedSwapStatus() {
      const updatedAccounts = await Promise.all(accounts.map(updateAccountSwapStatus));
      if (!cancelled) {
        updatedAccounts.filter(Boolean).forEach(account => {
          dispatch(updateAccountWithUpdater(account.id, a => account));
        });
      }
    }

    fetchUpdatedSwapStatus();
    return () => (cancelled = true);
  }, [accounts, dispatch]);

  const hasPendingSwapOperations = useMemo(() => {
    if (mappedSwapOperations) {
      for (const section of mappedSwapOperations) {
        for (const swapOperation of section.data) {
          if (operationStatusList.pending.includes(swapOperation.status)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [mappedSwapOperations]);

  useInterval(() => {
    if (hasPendingSwapOperations) {
      updateSwapStatus();
    }
  }, 10000);

  const openSwapOperationDetailsModal = useCallback(
    mappedSwapOperation => setDrawer(SwapOperationDetails, { mappedSwapOperation }),
    [],
  );

  return (
    <>
      <TrackPage category="Swap" name="History" />
      <Box horizontal flow={2} alignItems="center" justifyContent="flex-end">
        <ExportOperationsWrapper horizontal>
          <IconDownloadCloud size={16} />
          <Text ml={1} ff="Inter|Regular" fontSize={3}>
            <FakeLink onClick={exporting ? undefined : onExportOperations}>
              {exporting ? "Exporting..." : "Export operations"}
            </FakeLink>
          </Text>
        </ExportOperationsWrapper>
      </Box>
      {mappedSwapOperations ? (
        mappedSwapOperations.length ? (
          <Card>
            <Head px={20} py={16}>
              <Alert type="primary">
                <Trans i18nKey="swap.history.disclaimer" />
              </Alert>
            </Head>
            {mappedSwapOperations.map(section => (
              <div id="swap-history">
                <SectionTitle day={section.day} />
                <Box>
                  {section.data.map(mappedSwapOperation => (
                    <OperationRow
                      key={mappedSwapOperation.swapId}
                      mappedSwapOperation={mappedSwapOperation}
                      openSwapOperationDetailsModal={openSwapOperationDetailsModal}
                    />
                  ))}
                </Box>
              </div>
            ))}
          </Card>
        ) : (
          <Card
            flex={1}
            p={150}
            alignItems={"center"}
            justifyContent={"center"}
            id="swap-history-empty-state"
          >
            <Text mb={1} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade100">
              <Trans i18nKey={"swap.history.empty.title"} />
            </Text>
            <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade50">
              <Trans i18nKey={"swap.history.empty.description"} />
            </Text>
          </Card>
        )
      ) : (
        <Card
          flex={1}
          px={80}
          py={53}
          alignItems={"center"}
          justifyContent={"center"}
          style={{ minHeight: 438 }}
        >
          <BigSpinner size={50} />
        </Card>
      )}
    </>
  );
};

export default History;
