import React, { Component } from "react"
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  Linking
} from "react-native"
import Spotify from "rn-spotify-sdk"

class SpotifyView extends Component {
  state = {
    inputPlaylistURL:
      "https://open.spotify.com/user/geonnave/playlist/5TVPDoTAhcY1005jhBvZPz?si=2zS6BdfBQxmpGN9dnAeG_w",
    activePlaylistURL: "",
    spotifyInitialized: undefined
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
        console.log(`initialize error = ${loggedIn}`)
        console.log(error.message)
      })
  }

  spotifyLogin = () => {
    Spotify.login()
      .then(loggedIn => {
        if (loggedIn) {
          this.setState({ ...this.state, spotifyLoggedIn: true })
          console.log(`loggedIn = ${loggedIn}`)
        }
      })
      .catch(error => {
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
          <Text>Spotify </Text>
          <Text>{this.connectedAndLoggedInText()}</Text>
          <Button title="🔄" onPress={() => {}} />
        </View>
        <TextInput
          value={this.state.inputPlaylistURL}
          placeholder="Cole aqui a playlist"
          multiline={true}
          onChangeText={this.setPlaylist}
        />
        <View style={styles.horizontalContainer}>
          <Button
            style={styles.button}
            title="Limpar"
            color="grey"
            onPress={this.clearPlaylist}
          />
          <Button
            style={styles.button}
            title="Play"
            onPress={this.playPlaylist}
          />
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
    flex: 1,
    height: "45%",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    margin: "auto"
  }
})

export default SpotifyView
