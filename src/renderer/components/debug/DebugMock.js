// @flow
import React, { useCallback, useState } from "react";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import Text from "~/renderer/components/Text";
import { ReplaySubject } from "rxjs";
import { deserializeError } from "@ledgerhq/errors";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import { deviceInfo155, mockListAppsResult } from "@ledgerhq/live-common/lib/apps/mock";

import { addMockAnnouncement } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider/api/api.mock";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { toggleMockIncident } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/api/api.mock";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider";

import useInterval from "~/renderer/hooks/useInterval";
import Box from "~/renderer/components/Box";
import { Item, MockContainer, EllipsesText, MockedGlobalStyle } from "./shared";

/**
 * List of events that will be displayed in the quick-link section of the mock menu
 * to ease the usability when mock is done manually instead of through spectron.
 */
const helpfulEvents = [
  { name: "opened", event: { type: "opened" } },
  {
    name: "listApps",
    event: {
      type: "listingApps",
      deviceInfo: deviceInfo155,
    },
  },
  {
    name: "result",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar",
        "Bitcoin,Tron,Litecoin,Ethereum",
        deviceInfo155,
      ),
    },
  },
  {
    name: "resultOutdated",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar",
        "Bitcoin,Tron,Litecoin,Ethereum (outdated)",
        deviceInfo155,
      ),
    },
  },
  {
    name: "permission requested",
    event: { type: "device-permission-requested", wording: "Allow Ledger Manager" },
  },
  {
    name: "permission granted",
    event: { type: "device-permission-granted" },
  },
  { name: "quitApp", event: { type: "appDetected" } },
  { name: "unresponsiveDevice", event: { type: "unresponsiveDevice" } },
  { name: "complete", event: { type: "complete" } },
];

const swapEvents = [
  {
    name: "result without Exchange",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar",
        "Bitcoin,Tron,Litecoin,Ethereum",
        deviceInfo155,
      ),
    },
  },
  {
    name: "result with outdated Exchange",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar,Exchange",
        "Exchange(outdated),Tron,Bitcoin,Ethereum",
        deviceInfo155,
      ),
    },
  },
  {
    name: "result with Exchange",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar,Exchange",
        "Exchange,Tron,Bitcoin,Ethereum",
        deviceInfo155,
      ),
    },
  },
  {
    name: "result with only Exchange",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar,Exchange",
        "Exchange",
        deviceInfo155,
      ),
    },
  },
  {
    name: "result with only Exchange+BTC",
    event: {
      type: "result",
      result: mockListAppsResult(
        "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar,Exchange",
        "Exchange,Bitcoin",
        deviceInfo155,
      ),
    },
  },
  {
    name: "init-swap-requested",
    event: {
      type: "init-swap-requested",
    },
  },
  {
    name: "init-swap-error",
    event: {
      type: "init-swap-error",
      error: { name: "SwapGenericAPIError" },
    },
  },
  {
    name: "init-swap-result",
    event: {
      type: "init-swap-result",
      initSwapResult: {
        transaction: fromTransactionRaw({
          family: "bitcoin",
          recipient: "1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e",
          amount: "1",
          feePerByte: "1",
          networkInfo: {
            family: "bitcoin",
            feeItems: {
              items: [
                { key: "0", speed: "high", feePerByte: "3" },
                { key: "1", speed: "standard", feePerByte: "2" },
                { key: "2", speed: "low", feePerByte: "1" },
              ],
              defaultFeePerByte: "1",
            },
          },
          rbf: false,
          utxoStrategy: {
            strategy: 0,
            pickUnconfirmedRBF: false,
            excludeUTXOs: [],
          },
        }),
        swapId: "12345",
      },
    },
  },
];

if (getEnv("MOCK")) {
  window.mock = {
    events: {
      test: 0,
      queue: [],
      history: [],
      subject: new ReplaySubject<any>(),
      get parseRawEvents() {
        return (rawEvents, maybeKey): Object => {
          if (rawEvents && typeof rawEvents === "object") {
            if (maybeKey === "error") {
              return deserializeError(rawEvents);
            }
            if (Array.isArray(rawEvents)) return rawEvents.map(this.parseRawEvents);
            const event = {};
            for (const k in rawEvents) {
              if (rawEvents.hasOwnProperty(k)) {
                event[k] = this.parseRawEvents(rawEvents[k], k);
              }
            }
            return event;
          }
          return rawEvents;
        };
      },
      get emitter() {
        return () => {
          // Cleanup the queue of complete events
          while (this.queue.length && this.queue[0].type === "complete") {
            this.queue.shift();
          }

          if (this.subject.isStopped) {
            this.subject = new ReplaySubject<any>();
          }

          return this.subject;
        };
      },
      get mockDeviceEvent() {
        return (...o: any[]) => {
          for (const e of this.parseRawEvents(o)) this.queue.push(e);
        };
      },
      exposed: {
        mockListAppsResult,
        deviceInfo155,
      },
    },
  };

  const observerAwareEventLoop = () => {
    const { subject, queue, history } = window.mock.events;
    while (subject.observers.length && !subject.isStopped && queue.length) {
      const event = queue.shift();
      if (event.type === "complete") {
        subject.complete();
        window.mock.events.subject = new ReplaySubject<any>();
      } else {
        subject.next(event);
      }
      history.push(event);
    }

    // If no observers consume "complete" events that are on top of the list
    while (!subject.observers.length && queue.length && queue[0].type === "complete") {
      const event = queue.shift();
      subject.complete();
      history.push(event);
      window.mock.events.subject = new ReplaySubject<any>();
    }
    setTimeout(observerAwareEventLoop, 400);
  };

  observerAwareEventLoop();
}

// $FlowFixMe
export const mockedEventEmitter = getEnv("MOCK") ? window.mock.events.emitter : null;

const DebugMock = () => {
  const [queue, setQueue] = useState(window.mock.events.queue);
  const [history, setHistory] = useState(window.mock.events.history);
  const [nonce, setNonce] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [expandedQueue, setExpandedQueue] = useState(true);
  const [expandedSwap, setExpandedSwap] = useState(false);
  const [expandedNotif, setExpandedNotif] = useState(false);
  const [expandedQuick, setExpandedQuick] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(true);

  const { updateCache } = useAnnouncements();
  const { updateData } = useFilteredServiceStatus();

  useInterval(() => {
    setQueue(window.mock.events.queue);
    setHistory(window.mock.events.history);
    setNonce(nonce + 1);
  }, 2000);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);
  const toggleExpandedQueue = useCallback(() => setExpandedQueue(!expandedQueue), [expandedQueue]);
  const toggleExpandedQuick = useCallback(() => setExpandedQuick(!expandedQuick), [expandedQuick]);
  const toggleExpandedHistory = useCallback(() => setExpandedHistory(!expandedHistory), [
    expandedHistory,
  ]);
  const toggleExpandedSwap = useCallback(() => setExpandedSwap(!expandedSwap), [expandedSwap]);
  const toggleExpandedNotif = useCallback(() => setExpandedNotif(!expandedNotif), [expandedNotif]);

  const queueEvent = useCallback(
    event => {
      setQueue([...queue, event]);
      window.mock.events.mockDeviceEvent(event);
    },
    [queue, setQueue],
  );

  const unQueueEventByIndex = useCallback(
    i => {
      window.mock.events.queue.splice(i, 1);
      setQueue(window.mock.events.queue);
    },
    [setQueue],
  );

  return (
    <MockContainer id={nonce}>
      <Box>
        <Item
          id={nonce}
          color="palette.text.shade100"
          ff="Inter|Medium"
          fontSize={3}
          onClick={toggleExpanded}
        >
          {expanded ? "mock [ - ]" : "m"}
        </Item>
      </Box>
      {expanded ? (
        <>
          {queue.length ? (
            <Box vertical px={1}>
              <Text
                color="palette.text.shade100"
                ff="Inter|SemiBold"
                fontSize={3}
                onClick={toggleExpandedQueue}
              >
                {"queue "}
                {expandedQueue ? "[ - ]" : "[ + ]"}
              </Text>
              {expandedQueue
                ? queue.map((e, i) => (
                    <Box horizontal key={i}>
                      <Text
                        style={{ marginLeft: 10 }}
                        ff="Inter|Medium"
                        color="palette.text.shade100"
                        fontSize={3}
                        onClick={() => unQueueEventByIndex(i)}
                      >
                        {"[ x ] "}
                      </Text>
                      <EllipsesText title={JSON.stringify(e)}>{JSON.stringify(e)}</EllipsesText>
                    </Box>
                  ))
                : null}
            </Box>
          ) : null}
          {history.length ? (
            <Box vertical px={1}>
              <Text
                color="palette.text.shade100"
                ff="Inter|SemiBold"
                fontSize={3}
                onClick={toggleExpandedHistory}
              >
                {"history "}
                {expandedHistory ? "[ - ]" : "[ + ]"}
              </Text>
              {expandedHistory
                ? history.map((e, i) => (
                    <Box horizontal key={i} onClick={() => queueEvent(e)}>
                      <EllipsesText title={JSON.stringify(e)}>{JSON.stringify(e)}</EllipsesText>
                    </Box>
                  ))
                : null}
            </Box>
          ) : null}
          {/* Events here are supposed to be generic and not for a specific flow */}
          <Box vertical px={1}>
            <Text
              color="palette.text.shade100"
              ff="Inter|SemiBold"
              fontSize={3}
              onClick={toggleExpandedQuick}
            >
              {"quick-list "}
              {expandedQuick ? "[ - ]" : "[ + ]"}
            </Text>
            {expandedQuick
              ? helpfulEvents.map(({ name, event }, i) => (
                  <Text
                    mx={1}
                    ff="Inter|Regular"
                    color="palette.text.shade100"
                    fontSize={3}
                    key={i}
                    onClick={() => queueEvent(event)}
                  >
                    {name}
                  </Text>
                ))
              : null}
          </Box>
          <Box vertical px={1}>
            <Text
              color="palette.text.shade100"
              ff="Inter|SemiBold"
              fontSize={3}
              onClick={toggleExpandedSwap}
            >
              {"swap "}
              {expandedSwap ? "[ - ]" : "[ + ]"}
            </Text>
            {expandedSwap
              ? swapEvents.map(({ name, event }, i) => (
                  <Text
                    smx={1}
                    ff="Inter|Regular"
                    color="palette.text.shade100"
                    fontSize={3}
                    key={i}
                    onClick={() => queueEvent(event)}
                  >
                    {name}
                  </Text>
                ))
              : null}
          </Box>
          <Box vertical px={1}>
            <Text
              color="palette.text.shade100"
              ff="Inter|SemiBold"
              fontSize={3}
              onClick={toggleExpandedNotif}
            >
              {"notif "}
              {expandedNotif ? "[ - ]" : "[ + ]"}
            </Text>
            {expandedNotif ? (
              <>
                <Text
                  smx={1}
                  ff="Inter|Regular"
                  color="palette.text.shade100"
                  fontSize={3}
                  onClick={() => {
                    addMockAnnouncement();
                    updateCache();
                  }}
                >
                  {"Mock notif"}
                </Text>
                <Text
                  smx={1}
                  ff="Inter|Regular"
                  color="palette.text.shade100"
                  fontSize={3}
                  onClick={() => {
                    toggleMockIncident();
                    updateData();
                  }}
                >
                  {"Toggle service status"}
                </Text>
              </>
            ) : null}
          </Box>
        </>
      ) : null}
    </MockContainer>
  );
};

export default process.env.HIDE_DEBUG_MOCK ? MockedGlobalStyle : DebugMock;
