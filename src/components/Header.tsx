
import React, {Component} from 'react';
import { Header, Button, Left, Right, Icon, Body, Title, } from 'native-base';

interface Props { navigation : any };
export default class HeaderComponent extends Component<Props> {

  evaluateTitle() {
    if (this.props.navigation.state.routeName) {
      return this.props.navigation.state.routeName;
    }
    return;
  }

  render() {
    return (
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.openDrawer()} >
            <Icon name="ios-menu" />
          </Button>
        </Left>
        <Body>
          <Title>{this.evaluateTitle()}</Title>
        </Body>
        <Right />
      </Header>
    ); 
  }
}
