import { Alert, Platform } from 'react-native';

export default function show (text) {
  if (Platform.OS === 'web') {
    alert(text);
  } else {
    Alert.alert(
      'Igigi',
      text,
      [{ text: 'OK', onPress: () => {} }],
      { cancelable: false }
    );
  }
}
