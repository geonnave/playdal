import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Button, Text} from 'react-native';

const spotifyView = props => {
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
      />
      <View style={styles.horizontalContainer}>
        <Button style={styles.button}
          title="Limpar"
          color="grey"
          onPress={() => {}}
        />
        <Button style={styles.button}
          title="Play"
          onPress={() => {}}
        />
      </View>
    </View>
  )
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

export default spotifyView;