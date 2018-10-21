import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Button, Text, Linking} from 'react-native';

class SpotifyView extends Component {
  state = {
    playlistURI: "spotify:user:geonnave:playlist:5TVPDoTAhcY1005jhBvZPz",
    playlistURL: "https://open.spotify.com/user/geonnave/playlist/5TVPDoTAhcY1005jhBvZPz?si=2zS6BdfBQxmpGN9dnAeG_w"
  }

  extractHash = (playlistURL) => {
    return playlistURL.replace(/^.*playlist\/([a-zA-Z0-9]+).*$/, "$1")
  }

  playPlaylist = () => {
    Linking.openURL(this.state.playlistURL).catch(err => console.error('An error occurred', err))
  }

  setPlaylist = (playlist) => {
    this.setState({...this.state, playlistURL: playlist})
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.horizontalContainer}>
          <Text>Spotify </Text>
          <Text>não conectado </Text>
          <Button title="🔄" onPress={() => {}} />
        </View>
        <TextInput
          placeholder="Cole aqui a playlist"
          multiline={true}
          onChange={this.setPlaylist}
        />
        <View style={styles.horizontalContainer}>
          <Button style={styles.button}
            title="Limpar"
            color="grey"
            onPress={() => {}}
          />
          <Button style={styles.button}
            title="Play"
            onPress={this.playPlaylist}
          />
        </View>
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

export default SpotifyView;