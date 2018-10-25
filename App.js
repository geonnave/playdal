import React, { Component } from "react"
import { StyleSheet, TextInput, View, Button, Text } from "react-native"

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

  render() {
    return (
      <View style={styles.container}>
        <SpotifyView onRef={ref => (this.spotifyView = ref)} />
        <DevicesView changePressedState={this.changePressedState} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
