import React, { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import Dropbox from '../model/dropbox.js';
import Popup from './Popup';

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
          Popup.show(error);
        }
      );
  }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>
        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 30, fontWeight: 'bold' }}>Dropbox</Text>
        <Button onPress={ () => this.authorize() } title='Get code' />
        <TextInput style={{ marginTop: 20, marginBottom: 20 }}
          value={this.state.code}
          editable={true}
          placeholder='Paste code here'
          onChangeText={(text) => this.setState({ code: text })} />
        <Button style={{ marginLeft: 10 }} onPress={ () => this.save() } title='Save code' />
      </View>
    );
  }
}
