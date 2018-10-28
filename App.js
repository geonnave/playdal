import React, { Component } from "react"
import {
  StyleSheet,
  View,
  StatusBar,
  ToolbarAndroid,
  TouchableOpacity,
  Image
} from "react-native"

import SpotifyView from "./src/components/SpotifyView/SpotifyView"
import DevicesView from "./src/components/DevicesView/DevicesView"

type Props = {}
export default class App extends Component<Props> {
  changePressedState = pressState => {
    if (pressState == "pressed") {
      this.spotifyView.pedalPressed()
    } else {
      this.spotifyView.pedalReleased()
    }
  }

  fakePressed = () => this.spotifyView.pedalPressed()
  fakeReleased = () => this.spotifyView.pedalReleased()

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          title="Playdal"
          titleColor="#fff"
          style={{ height: 56, backgroundColor: "#0D1134" }}
        />
        <StatusBar backgroundColor="#0D1134" barStyle="light-content" />
        <SpotifyView onRef={ref => (this.spotifyView = ref)} />
        <View style={styles.separator} />
        <DevicesView changePressedState={this.changePressedState} />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPressIn={this.fakePressed}
            onPressOut={this.fakeReleased}
          >
            <Image
              source={require("./icon.png")}
              style={{ width: 48, height: 48 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A57DB9"
  },
  separator: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginLeft: "2%",
    marginRight: "2%"
  }
})
