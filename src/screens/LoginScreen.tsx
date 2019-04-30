
import React, {Component} from 'react';
import { StyleSheet, View, Image, Dimensions} from 'react-native';
import { Container, Content, Button, Text, Item, Input, Form, Label, Toast, } from 'native-base';
import FacebookAuthButton from '../components/FacebookAuthButton';
import firebase from 'firebase';
import NavigationService from '../services/NavigationService'

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

interface Props { navigation : any };
interface State { email: string, password: string };
export default class LoginScreen extends Component<Props, State> {

  constructor(props) {
    super(props);
    this.resetForm();
  }

  resetForm() {
    this.state = {
      email: '',
      password: ''
    }
  }

  login(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        NavigationService.navigate('Home');
        this.resetForm();

        Toast.show({
          text: "Login successful!",
          buttonText: "OK",
          duration: 2500
        });
      })
      .catch((error) => {
        let message = error.message ? error.message : "Oops! Something went wrong. Please, try again later.";

        Toast.show({
          text: message,
          buttonText: "OK",
          duration: 5000
        });
      }
    );
    
  }

  signUp(email: string, password: string) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        NavigationService.navigate('Home');
        this.resetForm();
        
        Toast.show({
          text: "Account created!",
          buttonText: "OK",
          duration: 2500
        });
      })
      .catch(function(error) {
        let message = error.message ? error.message : "Oops! Something went wrong. Please, try again later.";
        
        Toast.show({
          text: message,
          buttonText: "OK",
          duration: 5000
        });
      });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content style={styles.content}>
          <View style={styles.imgHolder}>
            <Image source={require('../assets/img/superlogica-logo-full.png')} style={styles.logo} />
          </View>

          <Form>
            <Item>
              <Label>E-mail</Label>
              <Input onChangeText={(email) => this.setState({email})} value={this.state.email} />
            </Item>
            <Item last>
              <Label>Senha</Label>
              <Input secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password} />
            </Item>

            <View style={styles.btnHolder}>
              <Button onPress={() => this.login(this.state.email, this.state.password)}>
                <Text>Logar</Text>
              </Button>
              <Button onPress={() => this.signUp(this.state.email, this.state.password)}>
                <Text>Criar conta</Text>
              </Button>
            </View>
            <View style={styles.btnHolder}>
              <FacebookAuthButton />
            </View>
          </Form>
          
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    height: screenHeight,
    width: screenWidth
  },
  imgHolder: {
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnHolder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20
  },
  logo: {
    width: 210,
    height: 238
  }
});