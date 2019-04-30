
import React, {Component} from 'react';

import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import { AppRegistry, BackHandler } from 'react-native';
import { Root } from 'native-base';

import firebase from 'firebase';

import NavigationService from './src/services/NavigationService';
import HomeScreen from './src/screens/HomeScreen'
import LoginScreen from './src/screens/LoginScreen'
import NewTaskScreen from './src/screens/NewTaskScreen';
import UpdateTaskScreen from './src/screens/UpdateTaskScreen';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA84cKtExaFaQ6httLlcBpAr5dsWXKfy0A",
  authDomain: "936727033765-5fbf0cihu3l646cmr24g8mapoq5dd4t1.apps.googleusercontent.com",
  databaseURL: "https://superlogica-challenge-1.firebaseio.com",
  storageBucket: "superlogica-challenge-1.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const TopLevelNavigator = createDrawerNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Home: { screen: HomeScreen },
    NewTask: { screen: NewTaskScreen },
    UpdateTask: {
      screen: UpdateTaskScreen,
      navigationOptions: {
        drawerLabel: () => null
      }
    }
  }
);

const AppContainer = createAppContainer(TopLevelNavigator);

export default class App extends Component {

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton() {
    NavigationService.navigate('Home');
    return true;
  }

  render() {
    return (
      <Root>
        <AppContainer ref={(navigatorRef) => {NavigationService.setTopLevelNavigator(navigatorRef)}} />
      </Root>
    );
  }
}

AppRegistry.registerComponent('AppNavigator', () => TopLevelNavigator);