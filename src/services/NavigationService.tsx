
import { NavigationActions } from 'react-navigation';

let navigator;

export default class NavigationService {

  static setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
  }

  static navigate(routeName, params = null) {
    navigator.dispatch(
      NavigationActions.navigate({routeName, params})
    );
  }

}
