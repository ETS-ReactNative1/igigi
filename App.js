import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GigView from './gui/GigView.js';
import DropboxView from './gui/DropboxView.js';

const Tab = createBottomTabNavigator();

function MyTabs () {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Gig" component={GigView} />
      <Tab.Screen name="Dropbox" component={DropboxView} />
    </Tab.Navigator>
  );
}

export default function App () {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
