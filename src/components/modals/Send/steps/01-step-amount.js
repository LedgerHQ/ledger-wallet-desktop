// @flow

import React, { PureComponent, Fragment } from 'react'
import type {Account, AccountLike, Transaction, TransactionStatus} from '@ledgerhq/live-common/lib/types'
import {
  getMainAccount,
  getAccountCurrency,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import CounterValue from 'components/CounterValue'
import Spinner from 'components/base/Spinner'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import FeeField from 'families/FeeField'
import AdvancedOptionsField from 'families/AdvancedOptionsField'
import RecipientField from '../fields/RecipientField'
import AmountField from '../fields/AmountField'
import HighFeeConfirmation from '../HighFeeConfirmation'
import ErrorBanner from '../../../ErrorBanner'
import type { StepProps } from '../types'

const AccountFields = ({
  account,
  parentAccount,
  transaction,
  onChangeTransaction,
  openedFromAccount,
  t,
  status,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  onChangeTransaction: Transaction => void,
  openedFromAccount: boolean,
  t: *,
  status: TransactionStatus
}) => {
  const mainAccount = getMainAccount(account, parentAccount)
  return (
    <Fragment key={account.id}>
      <RecipientField
        status={status}
        autoFocus={openedFromAccount}
        account={mainAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        t={t}
      />

      <AmountField
        status={status}
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        onChangeTransaction={onChangeTransaction}
        t={t}
      />

      <FeeField account={mainAccount} transaction={transaction} onChange={onChangeTransaction} />

      <AdvancedOptionsField
        account={mainAccount}
        transaction={transaction}
        onChange={onChangeTransaction}
      />
    </Fragment>
  )
}

export default ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
}: StepProps) => {
  if (!status) return null

  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t('send.steps.amount.selectAccountDebit')}</Label>
        <SelectAccount
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>

      {account && transaction && !error && (
        <AccountFields
          status={status}
          error={error}
          key={account.id}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          onChangeTransaction={onChangeTransaction}
          openedFromAccount={openedFromAccount}
          t={t}
        />
      )}
    </Box>
  )
}

export class StepAmountFooter extends PureComponent<
  StepProps,
  {
    highFeesOpen: boolean,
  },
> {
  state = {
    highFeesOpen: false,
  }

  onNext = async () => {
    const {
      transitionTo,
      status: { showFeeWarning },
    } = this.props
    if (showFeeWarning) {
      this.setState({ highFeesOpen: true })
    }
    transitionTo('device')
  }

  onAcceptFees = () => {
    const { transitionTo } = this.props
    transitionTo('device')
  }

  onRejectFees = () => {
    this.setState({ highFeesOpen: false })
  }

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props
    const { highFeesOpen } = this.state
    if (!status) return null

    const mainAccount = account ? getMainAccount(account, parentAccount) : null
    const currency = account ? getAccountCurrency(account) : null

    const { amount, recipientError, transactionError, totalSpent } = status
    const isTerminated = (mainAccount && mainAccount.currency.terminated) || false
    const accountUnit = !account ? null : getAccountUnit(account)

    const canNext =
      !bridgePending &&
      status.amount &&
      !status.amount.isZero() &&
      !recipientError &&
      !transactionError &&
      totalSpent.gt(0)

    return (
      <Fragment>
        <Box grow>
          <Label>{t('send.totalSpent')}</Label>
          <Box horizontal flow={2} align="center">
            {accountUnit && (
              <FormattedVal
                disableRounding
                style={{ width: 'auto' }}
                color="dark"
                val={totalSpent}
                unit={accountUnit}
                showCode
              />
            )}
            <Box horizontal align="center">
              <Text ff="Rubik" fontSize={3}>
                {'(' /* eslint-disable-line react/jsx-no-literals */}
              </Text>
              {account && (
                <CounterValue
                  currency={currency}
                  value={totalSpent}
                  disableRounding
                  color="grey"
                  fontSize={3}
                  showCode
                  alwaysShowSign={false}
                />
              )}
              <Text ff="Rubik" fontSize={3}>
                {')' /* eslint-disable-line react/jsx-no-literals */}
              </Text>
            </Box>
            {bridgePending && <Spinner size={10} />}
          </Box>
        </Box>
        <Button primary disabled={!canNext || !!isTerminated} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
        {amount && accountUnit && (
          <HighFeeConfirmation
            isOpened={highFeesOpen}
            onReject={this.onRejectFees}
            onAccept={this.onAcceptFees}
            fees={totalSpent.minus(amount)}
            amount={amount}
            unit={accountUnit}
          />
        )}
      </Fragment>
    )
  }
}
