import React, { Component } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  ToastAndroid,
  PermissionsAndroid,
  TouchableOpacity,
  Alert
} from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"

import { BleManager } from "react-native-ble-plx"

class DevicesView extends Component {
  constructor(props) {
    super(props)
    this.manager = new BleManager()
    this.state = {
      device: undefined,
      deviceState: "disconnected",
      bleState: "unknown",
      pressedState: undefined,
      permissionIsGranted: PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      )
    }
  }

  changeBleStateHandler = state => {
    this.setState({ ...this.state, bleState: state })
  }

  changeDeviceStateHandler = state => {
    this.setState({ ...this.state, deviceState: state })
  }

  changePressedStateHandler = state => {
    this.setState({ ...this.state, pressedState: state })
    this.props.changePressedState(state)
  }

  deviceConnectedHandler = device => {
    this.setState({ ...this.state, device: device })
  }

  checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Playdal",
          message:
            "O App Playdal precisa acessar a sua localização para conectar com o pedal"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  connectBle = () => {
    if (this.state.device) {
      this.state.device.cancelConnection()
      this.changeDeviceStateHandler("disconnected")
      this.setState({
        ...this.state,
        device: undefined,
        pressedState: undefined
      })
    }
    this.manager.onStateChange(newState => {
      if (newState != "PoweredOn") return
      // ToastAndroid.show("Started scanning...", ToastAndroid.SHORT)
      this.changeBleStateHandler("scanning")
      this.manager.startDeviceScan(
        null,
        {
          allowDuplicates: true
        },
        (error, device) => {
          if (error) {
            ToastAndroid.show(
              "Houve um erro: " + error.message + ", " + error.reason,
              ToastAndroid.SHORT
            )
            return
          } else if (device) {
            console.log(device)
            console.log(device.name)
            if (device.name == "ESP32 GALAXIA Playdal") {
              ToastAndroid.show("Encontrou: " + device.name, ToastAndroid.SHORT)
              this.manager.stopDeviceScan()
              this.changeBleStateHandler("idle")

              device
                .connect()
                .then(device => {
                  // this.changeDeviceStateHandler("connected")
                  // ToastAndroid.show("Descobrindo serviços e características", ToastAndroid.SHORT)
                  return device.discoverAllServicesAndCharacteristics()
                })
                .then(device => {
                  // this.changeDeviceStateHandler("connected")
                  // ToastAndroid.show("Ajustando as notificações", ToastAndroid.SHORT)
                  return this.setupNotifications(device)
                })
                .then(
                  () => {
                    this.changeDeviceStateHandler("connected")
                    this.deviceConnectedHandler(device)
                    // ToastAndroid.show("Listening...", ToastAndroid.SHORT)
                  },
                  error => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT)
                  }
                )
            }
          }
        }
      )
    }, true)
  }

  setupNotifications = device => {
    const service = "cb0bd28b-76f8-4dc7-df90-05e68415f1eb"
    const charact = "8ec86328-c9ab-470c-98ec-82ff6f4148c5"
    this.changePressedStateHandler(undefined)

    device.monitorCharacteristicForService(
      service,
      charact,
      (error, characteristic) => {
        if (error) {
          this.changePressedStateHandler("error")
          return
        }
        if (characteristic.value == "AA==") {
          // AA== is 0 in base 64
          this.changePressedStateHandler("released")
        } else {
          this.changePressedStateHandler("pressed")
        }
      }
    )
  }

  async componentDidMount() {
    await this.checkPermission()
    this.manager.state().then(state => {
      if (state != "PoweredOn") {
        Alert.alert("Bluetooth desligado", "Ei, parece que o Bluetooth está desligado! Não esqueça de ligá-lo para podermos conectar com o pedal ;)")
      }
    })
    if (this.state.permissionIsGranted && !this.state.device) {
      this.connectBle()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Text>Bluetooth: {this.bleStateText()}</Text>
          <View style={{ width: 10 }} />
          <TouchableOpacity onPress={this.connectBle}>
            <Icon name="redo" size={18} style={{ color: "#0D1134" }} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }} />
        <View>
          <Text>
            Pedal: {this.pedalStateText()}
            {this.state.pressedState ? ", " : " "}
            {this.pedalPressedStateText()}
          </Text>
        </View>
      </View>
    )
  }

  bleStateText = () => {
    switch (this.state.bleState) {
      case "scanning":
        return "procurando..."
      case "idle":
        return "ligado"
      default:
        return "erro"
    }
  }

  pedalStateText = () => {
    switch (this.state.deviceState) {
      case "connected":
        return "conectado"
      case "disconnected":
        return "desconectado"
      default:
        return "erro"
    }
  }

  pedalPressedStateText = () => {
    switch (this.state.pressedState) {
      case "pressed":
        return "pressionado"
      case "released":
        return "solto"
      default:
        return ""
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    margin: "auto"
  },
  iconButton: {
    paddingRight: 0
  }
})

export default DevicesView
