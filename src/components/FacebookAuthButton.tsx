import React, { Component } from 'react';
import { View } from 'react-native';
import { Toast } from 'native-base';

import NavigationService from '../services/NavigationService';
import firebase from 'firebase'

import FBSDK from 'react-native-fbsdk';
const { LoginButton, AccessToken } = FBSDK;

export default class FacebookAuthButton extends Component {

  loginFinished(error, result) {
    if (error) {
      Toast.show({
        text: "Oops! Something went wrong. Please, try again later.",
        buttonText: "OK",
        duration: 5000
      });
    } else if (result.isCancelled) {
      Toast.show({
        text: "Facebook login cancelled.",
        buttonText: "OK",
        duration: 2500
      });
    } else {
      AccessToken.getCurrentAccessToken()
        .then((data) => {
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .then(() => {
              this.loginUserSuccess()
            })
            .catch((error) => {
              this.loginSignUpFail(error.message);
            });

        });
    }
  }

  logoutFinished() {
    NavigationService.navigate('Login');
    
    Toast.show({
      text: "Logout successful!",
      buttonText: "OK",
      duration: 2500
    });
  }

  loginUserSuccess() {
    NavigationService.navigate('Home');

    Toast.show({
      text: "Login successful!",
      buttonText: "OK",
      duration: 2500
    });
  }

  loginSignUpFail(error) {
    Toast.show({
      text: "Oops! Something went wrong. Please, try again later.",
      buttonText: "OK",
      duration: 5000
    });
  }
  
  render() {
    return (
      <View>
        <LoginButton
          readPermissions={['public_profile', 'email']}
          onLoginFinished={(error, result) => this.loginFinished(error, result)}
          onLogoutFinished={() => this.logoutFinished()}/>
      </View>
    );
  }
}
