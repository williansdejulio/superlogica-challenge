
import React, {Component} from 'react';

import { Text, CheckBox, View, Button, Toast } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import moment from 'moment';
import Task from '../utils/Interfaces'
import firebase from 'firebase';
import NavigationService from '../services/NavigationService';

interface Props { task: Task };
interface State { done: boolean };
export default class TaskItem extends Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      done: props.task.done
    }
  }

  deleteTask() {
    firebase.database().ref('tasks/'+ this.props.task.id).remove()
      .then(() => {
        Toast.show({
          text: "Task deleted!",
          buttonText: "OK",
          duration: 2500
        });
      })
      .catch(() => {
        Toast.show({
          text: "Oops! Something went wrong. Please, try again later.",
          buttonText: "OK",
          duration: 5000
        });
      });
  }

  updateTask() {
    NavigationService.navigate('UpdateTask', { itemId: this.props.task.id });
  }

  toggleDone() {
    let done = !this.state.done;
    this.setState({ done });
    
    firebase.database().ref('tasks/'+ this.props.task.id)
      .update({ done: done })
      .then((data) => {
        let message = (done) ? "Task done!" : "Task undone!";

        Toast.show({
          text: message,
          buttonText: "OK",
          duration: 1000
        });
      });
  }

  render() {
    const { task } = this.props;

    return (
      <View style={styles.taskItem}>
        <View style={styles.col1}>
          <CheckBox checked={this.state.done} onPress={() => this.toggleDone()}/>
        </View>
        <Text style={styles.col2}>
          {task.title}
        </Text>
        <Text style={styles.col3}>
          { moment(task.deadline).format("DD/MM/YYYY") }
        </Text>
        <View style={styles.col4}>
          <Button transparent style={styles.btnActions} onPress={() => this.updateTask()}>
            <Image source={require('../assets/img/btn-edit.png')} style={styles.btnActionsImg} />
          </Button>
          <Button transparent style={styles.btnActions} onPress={() => this.deleteTask()}>
            <Image source={require('../assets/img/btn-delete.png')} style={styles.btnActionsImg} />
          </Button>
        </View>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 25
  },
  btnActions: {
    height: 25,
    width: 25,
    marginRight: 15
  },
  btnActionsImg: {
    height: 20,
    width: 20,
  },
  col1: {width: '15%'},
  col2: {width: '40%'},
  col3: {width: '25%'},
  col4: {width: '15%', flexDirection: 'row' }
});
