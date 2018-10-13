import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Button, Text} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Text>Spotify </Text>
          <Text>não conectado </Text>
          <Button title="🔄" />
        </View>
        <TextInput
          placeholder="Cole aqui a playlist"
          multiline = {true}
        />
        <View style={styles.buttonContainer}>
          <Button style={{margin: "auto"}}
            title="Limpar"
            color="grey"
          />
          <Button style={{margin: "auto"}}
            title="Play"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "45%",
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
