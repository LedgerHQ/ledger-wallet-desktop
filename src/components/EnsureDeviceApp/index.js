// @flow
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { standardDerivation } from 'helpers/derivations'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import { getDevices } from 'reducers/devices'
import type { State as StoreState } from 'reducers/index'
import getAddress from 'commands/getAddress'

type OwnProps = {
  currency: ?CryptoCurrency,
  deviceSelected: ?Device,
  withGenuineCheck: boolean,
  account: ?Account,
  onStatusChange?: (DeviceStatus, AppStatus, ?string) => void,
  onGenuineCheck: (isGenuine: boolean) => void,
  // TODO prefer children function
  render?: ({
    appStatus: AppStatus,
    currency: CryptoCurrency,
    devices: Device[],
    deviceSelected: ?Device,
    deviceStatus: DeviceStatus,
    errorMessage: ?string,
  }) => React$Element<*>,
}

type Props = OwnProps & {
  devices: Device[],
}

type DeviceStatus = 'unconnected' | 'connected'

type AppStatus = 'success' | 'fail' | 'progress'

type State = {
  deviceStatus: DeviceStatus,
  appStatus: AppStatus,
  errorMessage: ?string,
}

const mapStateToProps = (state: StoreState) => ({
  devices: getDevices(state),
})

class EnsureDeviceApp extends PureComponent<Props, State> {
  state = {
    appStatus: 'progress',
    deviceStatus: this.props.deviceSelected ? 'connected' : 'unconnected',
    errorMessage: null,
  }

  componentDidMount() {
    if (this.props.deviceSelected !== null) {
      this.checkAppOpened()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { deviceStatus } = this.state
    const { deviceSelected, devices } = this.props
    const { devices: nextDevices, deviceSelected: nextDeviceSelected } = nextProps

    if (deviceStatus === 'unconnected' && !deviceSelected && nextDeviceSelected) {
      this.handleStatusChange('connected', 'progress')
    }

    if (deviceStatus !== 'unconnected' && devices !== nextDevices) {
      const isConnected = nextDevices.find(d => d === nextDeviceSelected)
      if (!isConnected) {
        this.handleStatusChange('unconnected', 'progress')
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { deviceSelected } = this.props
    const { deviceSelected: prevDeviceSelected } = prevProps

    if (prevDeviceSelected !== deviceSelected) {
      this.handleStatusChange('connected', 'progress')
      this._timeout = setTimeout(this.checkAppOpened, 250)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
    this._unmounted = true
  }

  checkAppOpened = async () => {
    const { deviceSelected, account, currency, withGenuineCheck } = this.props
    const { appStatus } = this.state

    if (!deviceSelected) {
      return
    }

    let appOptions

    if (account) {
      appOptions = {
        devicePath: deviceSelected.path,
        currencyId: account.currency.id,
        path: account.freshAddressPath,
        accountAddress: account.freshAddress,
        segwit: !!account.isSegwit,
      }
    } else if (currency) {
      appOptions = {
        devicePath: deviceSelected.path,
        currencyId: currency.id,
        path: standardDerivation({ currency, x: 0, segwit: false }),
      }
    }

    try {
      if (appOptions) {
        const { address } = await getAddress.send(appOptions).toPromise()
<<<<<<< HEAD
        if (account && account.freshAddress !== address) {
=======
        if (account && account.address !== address) {
>>>>>>> Skeleton for genuine check in onboarding
          throw new Error('Account address is different than device address')
        }
      } else {
        // TODO: real check if user is on the device dashboard
        if (!deviceSelected) {
          throw new Error('No device')
        }
        await sleep(1)
      }
      this.handleStatusChange(this.state.deviceStatus, 'success')

      if (withGenuineCheck && appStatus !== 'success') {
        this.handleGenuineCheck()
      }
    } catch (e) {
      this.handleStatusChange(this.state.deviceStatus, 'fail', e.message)
    }

    this._timeout = setTimeout(this.checkAppOpened, 1e3)
  }

  _timeout: *
  _unmounted = false

  handleStatusChange = (deviceStatus, appStatus, errorMessage = null) => {
    const { onStatusChange } = this.props
    clearTimeout(this._timeout)
    if (!this._unmounted) {
      this.setState({ deviceStatus, appStatus, errorMessage })
      onStatusChange && onStatusChange(deviceStatus, appStatus, errorMessage)
    }
  }

  handleGenuineCheck = async () => {
    // TODO: do a *real* genuine check
    await sleep(1)
    if (!this._unmounted) {
      this.setState({ genuineCheckStatus: 'success' })
      this.props.onGenuineCheck(true)
    }
  }

  render() {
    const { currency, account, devices, deviceSelected, render } = this.props
    const { appStatus, deviceStatus, genuineCheckStatus, errorMessage } = this.state

    if (render) {
      // if cur is not provided, we assume we want to check if user is on
      // the dashboard
      const cur = account ? account.currency : currency

      return render({
        appStatus,
        currency: cur,
        devices,
        deviceSelected: deviceStatus === 'connected' ? deviceSelected : null,
        deviceStatus,
        genuineCheckStatus,
        errorMessage,
      })
    }

    return null
  }
}

export default connect(mapStateToProps)(EnsureDeviceApp)

async function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1e3))
}
