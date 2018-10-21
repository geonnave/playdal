import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Button, Text, ToastAndroid, PermissionsAndroid } from 'react-native';

import { BleManager } from 'react-native-ble-plx';

class DevicesView extends Component {
  constructor(props) {
    super(props)
    this.manager = new BleManager();
    this.state = {
      device: undefined,
      deviceState: "disconnected",
      pressState: undefined,
      permissionIsGranted: PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }
  }

  changeBleStateHandler = (state) => {
    this.setState({...this.state, deviceState: state})
  }

  changePressStateHandler = (state) => {
    this.setState({...this.state, pressState: state})
    this.props.togglePlayback(state == "pressed")
  }

  deviceConnectedHandler = (device) => {
    this.setState({...this.state, device: device})
  }

  checkPermission = async () => {
    if (PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) {
      console.log("Location already granted")
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Playdal',
          'message': 'O App Playdal precisa acessar a sua localização para conectar com o pedal'
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
    this.manager.onStateChange(newState => {
      if (newState != "PoweredOn") return;
      // ToastAndroid.show("Started scanning...", ToastAndroid.SHORT)
      this.changeBleStateHandler("scanning")
      this.manager.startDeviceScan(
        null,
        {
          allowDuplicates: true
        },
        (error, device) => {
          if (error) {
            ToastAndroid.show("Houve um erro: " + error.message + ", " + error.reason, ToastAndroid.SHORT)
            return;
          } else if (device) {
            console.log(device)
            console.log(device.name)
            if (device.name == "ESP32 GALAXIA Playdal") {
              ToastAndroid.show('Encontrou: ' + device.name, ToastAndroid.SHORT)
              this.manager.stopDeviceScan()
              this.changeBleStateHandler("found")

              device.connect()
              .then((device) => {
                this.changeBleStateHandler("connected")
                // ToastAndroid.show("Descobrindo serviços e características", ToastAndroid.SHORT)
                return device.discoverAllServicesAndCharacteristics()
              })
              .then((device) => {
                this.changeBleStateHandler("connected..")
                // ToastAndroid.show("Ajustando as notificações", ToastAndroid.SHORT)
                return this.setupNotifications(device)
              })
              .then(() => {
                this.changeBleStateHandler("connected!")
                this.deviceConnectedHandler(device);
                // ToastAndroid.show("Listening...", ToastAndroid.SHORT)
              }, (error) => {
                ToastAndroid.show(error.message, ToastAndroid.SHORT)
              })
            }
          }
        }
        );
    }, true);
  }

  setupNotifications = (device) => {
    const service = "cb0bd28b-76f8-4dc7-df90-05e68415f1eb"
    const charact = "8ec86328-c9ab-470c-98ec-82ff6f4148c5"
    this.changePressStateHandler("released")

    device.monitorCharacteristicForService(service, charact, (error, characteristic) => {
      if (error) {
        this.changePressStateHandler("error")
        return
      }
      if (characteristic.value == "AA==") { // AA== is 0 in base 64
        this.changePressStateHandler("released")
      } else {
        this.changePressStateHandler("pressed")
      }
    })
  }

  async componentDidMount() {
    await this.checkPermission();
    if (this.state.permissionIsGranted && !this.state.device) {
      this.connectBle();
    }
  }

  render() {
    return (
      <View style={styles.container} >
      <Text>Os playdals aparecem aqui</Text>
      <Text>Pedal: {this.state.deviceState}, {this.state.pressState}</Text>
      <Button title="🔄" onPress={this.connectBle} />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "45%",
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: "auto"
  }
});

export default DevicesView;