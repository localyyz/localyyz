import React from "react";
import { AppState, Alert, Platform, Linking } from "react-native";
import { createStackNavigator, createTabNavigator } from "react-navigation";

// custom
import { Styles, Colours, Config, DEV_REMOTE_API } from "localyyz/constants";
import { NavBar } from "localyyz/components";
import { stores } from "localyyz/stores";
import { ApiInstance, GA, OS } from "localyyz/global";
import { getActiveRoute } from "localyyz/helpers";

// third party
import { observer, Provider } from "mobx-react/native";
import codePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";

//scenes
import {
  Onboarding,
  Home,
  SearchBrowse,
  Product,
  ProductListStack,
  Login,
  Cart,
  Deeplink,
  Modal,
  Settings,
  DiscountsScene
} from "localyyz/scenes";

// debug
console.disableYellowBox = true;

@observer
class AppView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hasMinVersion: this.isMinVersion
    };
    // initialize api instance with API_URL from User defined vars
    ApiInstance.initialize(
      Config.DEV_USE_REMOTE_API ? DEV_REMOTE_API : props.API_URL
    );
    GA.initialize(props.GOOGLE_ANALYTICS_KEY);
    if (props.ONESIGNAL_APPID != "") {
      OS.initialize(props.ONESIGNAL_APPID);
    }
  }

  get isMinVersion() {
    return (
      Platform.OS !== "ios"
      || (Platform.OS === "ios" && parseInt(DeviceInfo.getBuildNumber()) >= 300)
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
              onPress: () =>
                Linking.openURL(
                  "itms-apps://itunes.apple.com/us/app/id1185735010?mt=8"
                )
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

    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: true
      },
      codePushStatus => {
        if (
          codePushStatus === codePush.SyncStatus.UPDATE_INSTALLED
          || codePushStatus === codePush.SyncStatus.UNKNOWN_ERROR
          || codePushStatus === codePush.SyncStatus.UP_TO_DATE
        ) {
          stores.deviceStore.sendDeviceData();
        }
      }
    );

    //NOTE: this has to be syncronous because home will render products
    //before we pull user data out of storage. in that case, backend
    //won't have user data and return un-personalized results.

    //TODO: make a "session" scene that redirects to home
    stores.loginStore.login("storage");
  }

  // this tracks navigations and sends screen transitions to Google Analytics
  trackScreen = (prevState, currentState) => {
    const currentScreen = getActiveRoute(currentState);
    const prevScreen = getActiveRoute(prevState);

    if (currentScreen !== prevScreen) {
      switch (currentScreen.routeName.toLowerCase()) {
        case "productlist":
          GA.trackEvent("collection", "view", currentScreen.params.title);
          GA.trackScreen("collection");
          break;
        case "product":
          GA.trackEvent(
            "product",
            "view",
            currentScreen.params.product.title,
            currentScreen.params.product.price,
            {
              impressionList:
                currentScreen.params.product.listTitle
                || currentScreen.params.listTitle,
              products: [currentScreen.params.product.toGA()],
              productAction: {
                // ecommerce: product detail view
                // -> click is for favourite
                productActionList: currentScreen.params.product.listTitle,
                action: GA.ProductActions.Detail
              }
            }
          );

          GA.trackScreen("product");
          break;
        case "orders":
          GA.trackEvent("settings", "view orders", "order history");
          GA.trackScreen("settings - orders");
          break;
        case "addresses":
          GA.trackEvent("settings", "view account", "saved addresses");
          GA.trackScreen("settings - saved addresses");
          break;
        case "addressform":
          GA.trackEvent("settings", "view account", "edit addresses");
          GA.trackScreen("settings - edit addresses");
          break;
        case "modal":
          GA.trackEvent(
            currentScreen.params.type,
            "view",
            currentScreen.params.title
          );
          GA.trackScreen(currentScreen.params.type);
          break;
        default:
          // by default, track screen names
          GA.trackScreen(currentScreen.routeName.toLowerCase());
      }
    }
  };

  render() {
    if (!this.state.hasMinVersion) {
      return null;
    }

    return (
      <Provider {...stores} suppressChangedStoreWarning>
        <RootNavigator onNavigationStateChange={this.trackScreen} />
      </Provider>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Product: { screen: Product },
    ProductList: { screen: ProductListStack }
  },
  {
    initialRouteName: "Home",
    navigationOptions: ({ navigation: { state }, navigationOptions }) => ({
      ...navigationOptions,
      gesturesEnabled: state.params && state.params.gesturesEnabled,
      header: state.routeName === "Product" ? undefined : null,
      headerStyle: { borderBottomWidth: 0 },
      headerBackTitle: null,
      headerTintColor: Colours.LabelBlack,
      headerTransparent: state.routeName === "Product"
    })
  }
);

const TabNavigator = createTabNavigator(
  {
    Root: { screen: AppNavigator },
    SearchBrowse: { screen: SearchBrowse },
    Deals: { screen: DiscountsScene },
    Settings: { screen: Settings },
    Cart: { screen: Cart }
  },
  {
    navigationOptions: ({ navigation: { state } }) => {
      const currentScreen = getActiveRoute(state);
      return {
        tabBarVisible:
          currentScreen.routeName !== "Product"
          && !currentScreen.routeName.startsWith("Filter")
      };
    },
    tabBarComponent: NavBar,
    tabBarPosition: "bottom",
    lazy: true,
    animationEnabled: false
  }
);

const RootNavigator = createStackNavigator(
  {
    Deeplink: { screen: Deeplink },
    Login: { screen: Login },
    Modal: { screen: Modal },
    Onboarding: {
      screen: Onboarding,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    App: { screen: TabNavigator }
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
})(AppView);
