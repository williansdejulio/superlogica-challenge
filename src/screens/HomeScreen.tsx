
import React, {Component} from 'react';
import { StyleSheet, View, Dimensions, SectionList } from 'react-native';
import { Container, Content, Button, Text, Icon, Fab } from 'native-base';

import Header from '../components/Header';
import TaskItem from '../components/TaskItem'
import Task from '../utils/Interfaces'

import FBSDK from 'react-native-fbsdk';
const { LoginManager } = FBSDK;

import firebase from 'firebase';

import { YellowBox } from 'react-native';
import NavigationService from '../services/NavigationService';
YellowBox.ignoreWarnings(['Setting a timer']); // Fix unnecessary Timer warnings

const screenWidth = Dimensions.get("screen").width;

interface Props { navigation : any };
interface State { taskList : Array<Task> };
export default class HomeScreen extends Component<Props, State> {

  constructor(props) {
    super(props);
    
    this.state = {
      taskList: [],
    };
  }
  
  componentDidMount() {
    this.initTaskList();
  };

  logout() {
    LoginManager.logOut();
    firebase.auth().signOut();

    NavigationService.navigate("Login");
  }

  initTaskList() {
    firebase.database().ref('tasks/').on('value', (snapshot) => {
      let tasks = [];

      snapshot.forEach(function(item) {
        var id = item.key;
        var task = item.val();

        task.id = id;
        tasks.push(task);
      });

      this.setState({taskList: tasks});
    });
  }

  renderTasks() {
    if (!this.state.taskList.length)
      return;

    return (
      <SectionList
        keyExtractor={(item, index) => item.id}
        renderSectionHeader={() => (
          <View style={styles.taskHeader}>
            <Text style={[styles.col1, styles.titleSection]}>Done</Text>
            <Text style={[styles.col2, styles.titleSection]}>Title</Text>
            <Text style={[styles.col3, styles.titleSection]}>Deadline</Text>
            <Text style={[styles.col4, styles.titleSection]}></Text>
          </View>
        )}
        renderItem={({ item, index, section }) => 
          <TaskItem task={item} />
        }
        sections={[
          { data: this.state.taskList },
        ]}
      />

    )
  }

  render() {
    return (
      <Container>
        <Header navigation={this.props.navigation} />
        <View style={styles.btnLogoutHolder}>
          <Button style={styles.btnLogout} onPress={() => this.logout()}>
            <Text>Logout</Text>
          </Button>
        </View>

        <Text style={styles.titlePage}>TASKS TODO</Text>

        <Content>
          {this.renderTasks()}
        </Content>
        <Fab
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => { NavigationService.navigate('NewTask') }}>
          <Icon name="add" />
        </Fab>

      </Container>
    ); 
  }
}

const styles = StyleSheet.create({
  btnLogoutHolder: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlus: {
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: '#ee6e73',                                    
    position: 'absolute',                                          
    bottom: 10,                                                    
    right: 10, 
  },
  btnLogout: {
    marginTop: 10
  },
  titleSection: {
    fontWeight: 'bold',
    fontSize: 15
  },
  titlePage: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    margin: 25
  },
  taskHeader: {
    flexDirection: 'row',
    width: screenWidth,
    marginLeft: 20
  },
  col1: {width: '15%'},
  col2: {width: '40%'},
  col3: {width: '25%'},
  col4: {width: '15%'}
});
