import { Linking, AsyncStorage } from 'react-native';
import { Audio } from 'expo-av';

const _DROPBOX_APP_KEY = '3zhw5p77bps6yfp';
const _DROPBOX_APP_SECRET = 'yyd1u8q4w94qwmv';
const _LOCAL_TOKEN_KEY = 'token';
const _DOWNLOAD_URL = 'https://content.dropboxapi.com/2/files/download';
const _TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

export default class Dropbox {
  async setCode (code) {
    var tokenURL = _TOKEN_URL;
    tokenURL = tokenURL + '?code=' + code;
    tokenURL = tokenURL + '&grant_type=authorization_code';

    var tokenResponse = await fetch(tokenURL,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(_DROPBOX_APP_KEY + ':' + _DROPBOX_APP_SECRET)
        }
      }
    );

    var tokenOutput = await tokenResponse.json();
    if (tokenOutput.error_description !== undefined) {
      throw tokenOutput.error_description;
    }
    var userToken = tokenOutput.access_token;

    AsyncStorage.setItem(_LOCAL_TOKEN_KEY, userToken);
  }

  authorize () {
    var url = 'https://www.dropbox.com/oauth2/authorize?client_id=' + _DROPBOX_APP_KEY + '&response_type=code';
    Linking.openURL(url);
  }

  async getModelFile () {
    var userToken = await this._getToken();

    var response = await fetch(_DOWNLOAD_URL,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + userToken,
          'Dropbox-API-Arg': '{"path": "/igigi.json"}'
        }
      }
    );

    var jsonOutput = await response.json();
    if (jsonOutput.error_summary !== undefined) {
      throw jsonOutput.error_summary;
    }

    return jsonOutput;
  }

  async getAudio (url) {
    var audio = new Audio.Sound();
    await audio.loadAsync({ uri: url }, {}, true);
    return audio;
  }

  async _getToken () {
    try {
      var output = await AsyncStorage.getItem(_LOCAL_TOKEN_KEY);
      if (output !== null) { return output; }
    } catch (error) { }
    throw Error('Get a new DropBox code first');
  }
}
