import React from "react";
import { AppState, Alert, Platform, Linking, View } from "react-native";
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator
} from "react-navigation";

// custom
import { Colours } from "localyyz/constants";
import { NavBar } from "localyyz/components";
import { stores } from "localyyz/stores";
import { ApiInstance } from "localyyz/global";
import GlobalAssistant from "./components/NavBar/components/GlobalAssistant";

// third party
import { observer, Provider } from "mobx-react";
import codePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";

//scenes
import {
  Home,
  Product,
  ProductList,
  Login,
  CartSummary,
  Deeplink,
  Information,
  History,
  Brands
} from "localyyz/scenes";

const AppNavigator = StackNavigator(
  {
    Home: { screen: Home },
    Product: { screen: Product },
    ProductList: { screen: ProductList },
    CartSummary: { screen: CartSummary },
    Information: { screen: Information },
    Brands: { screen: Brands }
  },
  {
    initialRouteName: "Home",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

const HistoryTab = StackNavigator(
  {
    History: { screen: History },
    Product: { screen: Product }
  },
  {
    initialRouteName: "History",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

//TODO: NavBar should probably read from navigationOptions
//rather than everything mostly hardcoded
const TabBarNavigator = TabNavigator(
  {
    Root: { screen: AppNavigator },
    History: { screen: HistoryTab }
  },
  {
    tabBarComponent: NavBar,
    tabBarPosition: "bottom",
    lazy: true
  }
);

const RootNavigator = StackNavigator(
  {
    Deeplink: { screen: Deeplink },
    Login: { screen: Login },
    App: { screen: TabBarNavigator }
  },
  {
    mode: "modal",
    headerMode: "none",
    transitionConfig: () => ({
      screenInterpolator: forVertical
    }),
    cardStyle: { backgroundColor: Colours.Transparent }
  }
);

@observer
class AppContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hasMinVersion: this.isMinVersion
    };

    // initialize api instance with API_URL from User defined vars
    ApiInstance.initialize(props.API_URL);
  }

  get isMinVersion() {
    return (
      Platform.OS !== "ios"
      || (Platform.OS === "ios" && DeviceInfo.getBuildNumber() > 200)
    );
  }

  _verifyMinAppVersion = nextAppState => {
    if (this.state.hasMinVersion) {
      return;
    }

    if (!this.isMinVersion) {
      if (nextAppState === "active") {
        Alert.alert(
          "A newer version of the app is available",
          "Please download it via the app store",
          [
            {
              text: "OK",
              onPress: () => Linking.openURL("https://appstore.com/localyyz")
            }
          ],
          { cancelable: false }
        );
      }
    } else {
      this.setState({ hasMinVersion: true });
    }
  };

  componentWillMount() {
    this._verifyMinAppVersion("active");
  }

  componentDidMount() {
    AppState.addEventListener("change", this._verifyMinAppVersion);

    codePush.sync({
      installMode: codePush.InstallMode.IMMEDIATE,
      updateDialog: true
    });

    //NOTE: this has to be syncronous because home will render products
    //before we pull user data out of storage. in that case, backend
    //won't have user data and return un-personalized results.

    //TODO: make a "session" scene that redirects to home
    stores.loginStore.login("storage");
  }

  render() {
    if (!this.state.hasMinVersion) {
      return null;
    }

    return (
      <Provider {...stores} suppressChangedStoreWarning>
        <View style={{ flex: 1 }}>
          <RootNavigator
            navigation={addNavigationHelpers({
              dispatch: action => {
                stores.navStore.dispatch(RootNavigator.router, action);
              },
              state: stores.navStore.navigationState,
              addListener: () => {
                /* left blank intentionally */
              }
            })}/>
          <GlobalAssistant />
        </View>
      </Provider>
    );
  }
}

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props) {
  const { navigation, scene } = props;
  const focused = navigation.state.index === scene.index;

  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    transform: [{ translateX: translate }, { translateY: translate }]
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props) {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
    outputRange: [0.3, 0.9, 1, 0.9, 0.3]
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: [index - 1, index - 0.99, index, index + 1],
    outputRange: [height, height / 2, 0, 0]
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }]
  };
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
})(AppContainer);
