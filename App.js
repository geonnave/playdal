import React, { Component } from "react"
import { StyleSheet, TextInput, View, Button, Text } from "react-native"

import SpotifyView from "./src/components/SpotifyView/SpotifyView"
import DevicesView from "./src/components/DevicesView/DevicesView"

type Props = {}
export default class App extends Component<Props> {
  togglePlayback = shouldPlay => {
    this.spotifyView.togglePlayback(shouldPlay)
  }

  render() {
    return (
      <View style={styles.container}>
        <SpotifyView onRef={ref => (this.spotifyView = ref)} />
        <DevicesView togglePlayback={this.togglePlayback} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
