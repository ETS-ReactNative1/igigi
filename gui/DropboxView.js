import React, { Component, Alert } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import Dropbox from '../model/dropbox.js';

/* todo
    işbu formun tasarımını düzelt
    token save edilince bir tepki ver
*/

export default class DropboxView extends Component {
  constructor (props) {
    super(props);
    this._dropbox = new Dropbox();
    this.state = { code: '' };
  }

  authorize () {
    this._dropbox.authorize();
  }

  save () {
    this._dropbox.setCode(this.state.code)
      .then(
        function () { },
        function (error) {
          alert(error);
          Alert.alert(
            'Dropbox error',
            error,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        }
      );
  }

  render () {
    return (
      <View>
        <Text>Dropbox code</Text>
        <TextInput
          value={this.state.code}
          editable={true}
          placeholder='Paste code here'
          onChangeText={(text) => this.setState({ code: text })} />
        <Button onPress={ () => this.authorize() } title='Get code' />
        <Button onPress={ () => this.save() } title='Save code' />
      </View>
    );
  }
}
