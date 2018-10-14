import React, {Component} from 'react';
import {StyleSheet, TextInput, View, Button, Text} from 'react-native';

const devicesView = props => {
  return (
    <View style={styles.container} >
      <Text>Os playdals aparecem aqui</Text>
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

export default devicesView;