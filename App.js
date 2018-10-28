import React, { Component } from "react"
import { StyleSheet, View, StatusBar, ToolbarAndroid } from "react-native"

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
        <ToolbarAndroid
          title="PLAYDAL"
          titleColor="#fff"
          style={{ height: 56, backgroundColor: "#0D1134" }}
          logo={require("./icon_white.png")}
        />
        <StatusBar backgroundColor="#0D1134" barStyle="light-content" />
        <SpotifyView onRef={ref => (this.spotifyView = ref)} />
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            marginLeft: "2%",
            marginRight: "2%"
          }}
        />
        <DevicesView changePressedState={this.changePressedState} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A57DB9"
  }
})
