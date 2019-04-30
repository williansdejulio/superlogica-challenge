
import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Label, Input, DatePicker, Toast, CheckBox,} from 'native-base';

import Header from '../components/Header';

import firebase from 'firebase';
import moment from 'moment';
import NavigationService from '../services/NavigationService';

interface Props { navigation : any };
interface State { title: string, deadline: number, done: boolean }
export default class NewTaskScreen extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      deadline: 0,
      done: false
    };
  }

  resetForm() {
    this.setState({
      title: '',
      deadline: 0,
      done: false
    });
  }
  
  insertTask(newTask: {title: string, deadline: number, done: boolean}) {
    
    firebase.database().ref('tasks/')
      .push(newTask)
      .then((data) => {
        this.resetForm();
        
        Toast.show({
          text: "Task inserted!",
          buttonText: "OK",
          duration: 2500
        });

        NavigationService.navigate('Home');
      })
      .catch((error) => {
        Toast.show({
          text: "Oops! Something went wrong. Please, try again later.",
          buttonText: "OK",
          duration: 5000
        });
      });
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} />

        <Content>
          <Form>
            <Item>
              <Label>Título</Label>
              <Input onChangeText={(title) => this.setState({title})} value={this.state.title} autoCorrect={false} />
            </Item>

            <Item>
              <Label>Deadline</Label>
                  
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date()}
                locale={"en"}
                modalTransparent={false}
                animationType={"fade"}
                placeHolderText="Select deadline"
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={(date) => { this.setState({deadline: date.getTime()}) }}
                formatChosenDate={date => { return moment(date).format("DD/MM/YYYY"); }}
                />
            </Item>

            <Item last>
              <Label>Done?</Label>
              <View style={styles.heightField}>
                <CheckBox checked={this.state.done} onPress={() => this.setState({done: !this.state.done})} />
              </View>
            </Item>

            <View>
              <Button full onPress={ () => this.insertTask({title: this.state.title, deadline: this.state.deadline, done: this.state.done }) }>
                <Text>Insert</Text>
              </Button>
            </View>
          </Form>
        </Content>

      </Container>
    ); 
  }

}

const styles = StyleSheet.create({
  heightField: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center' 
  }
});
