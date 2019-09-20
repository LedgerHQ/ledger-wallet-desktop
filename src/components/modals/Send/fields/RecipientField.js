// @flow
import React, { useCallback } from 'react'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'
import Box from 'components/base/Box'
import LabelWithExternalIcon from 'components/base/LabelWithExternalIcon'
import RecipientAddress from 'components/RecipientAddress'
import { track } from 'analytics/segment'

type Props = {
  account: Account,
  transaction: Transaction,
  autoFocus?: boolean,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  t: T,
}

const RecipientField = ({
  t,
  account,
  transaction,
  onChangeTransaction,
  autoFocus,
  status,
}: Props) => {
  const onChange = useCallback(
    async (recipient: string, maybeExtra: ?Object) => {
      const { currency } = maybeExtra || {} // FIXME fromQRCode ?
      const invalidRecipient = currency && currency.scheme !== account.currency.scheme
      onChangeTransaction({ ...transaction, recipient: invalidRecipient ? undefined : recipient })
    },
    [account, transaction, onChangeTransaction],
  )

  const handleRecipientAddressHelp = useCallback(() => {
    openURL(urls.recipientAddressInfo)
    track('Send Flow Recipient Address Help Requested')
  }, [])

  if (!status) return null
  const { recipientError, recipientWarning } = status

  return (
    <Box flow={1}>
      <LabelWithExternalIcon
        onClick={handleRecipientAddressHelp}
        label={t('send.steps.amount.recipientAddress')}
      />
      <RecipientAddress
        autoFocus={autoFocus}
        withQrCode
        error={transaction.recipient && recipientError}
        warning={recipientWarning}
        value={transaction.recipient}
        onChange={onChange}
      />
    </Box>
  )
}

export default RecipientField
