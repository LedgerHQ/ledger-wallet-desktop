// @flow

import type { Observable } from "rxjs";
import { from } from "rxjs";
import type {
  ExchangeRateRaw,
  ExchangeRaw,
  SwapRequestEvent,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import type { TransactionRaw } from "@ledgerhq/live-common/lib/types";
import { fromTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import {
  fromExchangeRaw,
  fromExchangeRateRaw,
} from "@ledgerhq/live-common/lib/exchange/swap/serialization";
import initSwap from "@ledgerhq/live-common/lib/exchange/swap/initSwap";

type Input = {
  exchange: ExchangeRaw,
  exchangeRate: ExchangeRateRaw,
  transaction: TransactionRaw,
  deviceId: string,
  userId?: string,
  requireLatestFirmware?: boolean,
};

const cmd = ({
  exchange,
  exchangeRate,
  transaction,
  deviceId,
  userId,
  requireLatestFirmware,
}: Input): Observable<SwapRequestEvent> => {
  return from(
    initSwap({
      exchange: fromExchangeRaw(exchange),
      exchangeRate: fromExchangeRateRaw(exchangeRate),
      transaction: fromTransactionRaw(transaction),
      deviceId,
      userId,
      requireLatestFirmware,
    }),
  );
};
export default cmd;
