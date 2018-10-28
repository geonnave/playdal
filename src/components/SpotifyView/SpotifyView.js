import React, { Component } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  ToastAndroid,
  NativeModules,
  Slider,
  TouchableOpacity
} from "react-native"
import Spotify from "rn-spotify-sdk"
import Icon from "react-native-vector-icons/FontAwesome5"
import FeatherIcon from "react-native-vector-icons/Feather"
import { SliderVolumeController } from "react-native-volume-controller"

class SpotifyView extends Component {
  state = {
    inputPlaylistURL: "",
    activePlaylistURL: "",
    spotifyInitialized: undefined,
    highVolume: 0.85,
    lowVolume: 0.35
  }

  URLtoURI = playlistURL => {
    let user = playlistURL.replace(/^.*user\/(.*)\/playlist.*$/, "$1")
    let hash = playlistURL.replace(/^.*playlist\/([a-zA-Z0-9]+).*$/, "$1")
    let playlistURI = `spotify:user:${user}:playlist:${hash}`
    return playlistURI
  }

  URIdidNotChanged = () => {
    return (
      this.URLtoURI(this.state.inputPlaylistURL) ==
      this.URLtoURI(this.state.activePlaylistURL)
    )
  }

  validatePlaylist = playlistURL =>
    /https:\/\/open.spotify.com\/user\/.*\/playlist\/[a-zA-Z0-9]+/.test(
      playlistURL
    )

  playPlaylist = () => {
    if (!this.validatePlaylist(this.state.inputPlaylistURL)) {
      console.log(
        `Not playing invalid playlist URL: ${this.state.inputPlaylistURL}`
      )
      return
    }
    Spotify.getPlaybackStateAsync().then(playbackState => {
      console.log(playbackState)
      if (this.URIdidNotChanged()) {
        Spotify.setPlaying(!playbackState.playing)
      } else {
        this.setState({
          ...this.state,
          activePlaylistURL: this.state.inputPlaylistURL
        })
        let uri = this.URLtoURI(this.state.inputPlaylistURL)
        Spotify.playURI(uri, 0, 0)
      }
    })
  }

  togglePlayback = shouldPlay => {
    Spotify.setPlaying(shouldPlay)
  }

  pedalPressed = () => {
    NativeModules.ReactNativeVolumeController.change(this.state.highVolume)
    if (!Spotify.getPlaybackState().playing) {
      this.playPlaylist()
    }
  }

  pedalReleased = () => {
    NativeModules.ReactNativeVolumeController.change(this.state.lowVolume)
  }

  clearPlaylist = () => {
    this.setState({ ...this.state, inputPlaylistURL: "" })
  }

  setPlaylist = playlistURL => {
    console.log(playlistURL)
    this.setState({ ...this.state, inputPlaylistURL: playlistURL })
  }

  spotifyInitialize = () => {
    let spotifyOptions = {
      clientID: "0295a0b8b1c1477087246cd77b1841f5",
      sessionUserDefaultsKey: "SpotifySession",
      redirectURL: "com.galaxia.playdal://callback",
      scopes: [
        "user-read-private",
        "playlist-read",
        "playlist-read-private",
        "streaming",
        "app-remote-control"
      ]
    }
    Spotify.initialize(spotifyOptions)
      .then(loggedIn => {
        // update UI state
        this.setState({ ...this.state, spotifyInitialized: true })
        console.log(`initialize ok, loggedIn = ${loggedIn}`)
        // handle initialization
        if (loggedIn) {
          this.setState({ ...this.state, spotifyLoggedIn: true })
        } else {
          this.spotifyLogin()
        }
      })
      .catch(error => {
        this.setState({ ...this.state, spotifyInitialized: false })
        console.log(`initialize error = ${error.message}`)
      })
  }

  spotifyLogin = () => {
    Spotify.login()
      .then(loggedIn => {
        if (loggedIn) {
          this.setState({
            ...this.state,
            spotifyInitialized: true,
            spotifyLoggedIn: true
          })
          console.log(`loggedIn = ${loggedIn}`)
        }
      })
      .catch(error => {
        this.setState({ ...this.state, spotifyLoggedIn: false })
        console.log(`spotifyLogin error = ${error.message}`)
      })
  }

  componentDidMount() {
    this.props.onRef(this)
    Spotify.isInitializedAsync().then(is => {
      console.log(`isInitializedAsync = ${is}`)
      if (!is) {
        this.spotifyInitialize()
      }
    })
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Text>Spotify: </Text>
          <Text>{this.connectedAndLoggedInText()} </Text>
          <TouchableOpacity onPress={this.spotifyLogin}>
            <Icon name="redo" size={18} style={{ color: "#0D1134" }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, width: "80%", justifyContent: "center" }}>
            <TextInput
              style={styles.playlistInput}
              value={this.state.inputPlaylistURL}
              placeholder="Cole aqui a playlist"
              multiline={true}
              onChangeText={this.setPlaylist}
            />
          </View>
          <View
            style={{
              width: "20%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity onPress={this.clearPlaylist}>
              <FeatherIcon
                name="delete"
                size={24}
                style={{ color: "#0D1134" }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.horizontalContainer}>
          <TouchableOpacity
            onPress={this.playPlaylist}
            style={{ marginLeft: 10, marginRight: 10 }}
          >
            <Text style={{ fontSize: 32, color: "#0D1134" }}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  connectedAndLoggedInText = () => {
    if (this.state.spotifyInitialized && this.state.spotifyLoggedIn) {
      return "conectado"
    } else {
      return "não conectado"
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    marginLeft: 10,
    marginRight: 10
  },
  iconButton: {
    paddingRight: 0,
    backgroundColor: "#A57DB9"
  },
  playlistInput: {
    margin: 10
  }
})

export default SpotifyView
