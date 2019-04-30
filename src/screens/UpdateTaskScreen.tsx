
import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Label, Input, DatePicker, Toast, CheckBox } from 'native-base';

import Header from '../components/Header';
import Task from '../utils/Interfaces'

import firebase from 'firebase';
import moment from 'moment';
import NavigationService from '../services/NavigationService';

interface Props { navigation : any };
interface State { id: string; title: string; deadline: number; done: boolean; };
export default class UpdateTaskScreen extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
        id: '',
        title: '',
        deadline: 0,
        done: false
      
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (!params) {
      NavigationService.navigate('Home');
      return;
    }
    const itemId = params.itemId;
    
    firebase.database().ref('tasks/' + itemId).once('value', (snapshot) => {
      let item = snapshot.val();

      item.id = itemId;
      this.setState({ id: item.id, title: item.title, deadline: item.deadline, done: item.done });
      
    })
    .catch((err) => {
      NavigationService.navigate('Home');
    });
  }

  updateTask(task: Task) {
    
    firebase.database().ref('tasks/' + task.id)
      .update({ title: task.title, deadline: task.deadline, done: task.done })
      .then((data) => {
        
        Toast.show({
          text: "Task updated!",
          buttonText: "OK",
          duration: 2500
        });

        NavigationService.navigate('Home');
      });
  }
  

  evaluateDate(): Date {
    return new Date(this.state.deadline);
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
                defaultDate={this.evaluateDate()}
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
              <Button full onPress={() => this.updateTask(this.state)}>
                <Text>Update</Text>
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
