import React from "react";
import { AppState, Alert, Platform, Linking, View } from "react-native";
import { createStackNavigator, createTabNavigator } from "react-navigation";

// custom
import { Colours, Config, DEV_REMOTE_API } from "localyyz/constants";
import { NavBar } from "localyyz/components";
import { stores } from "localyyz/stores";
import { ApiInstance, GA, OS } from "localyyz/global";
import { getActiveRoute } from "localyyz/helpers";
import GlobalAssistant from "./components/NavBar/components/GlobalAssistant";

// third party
import { observer, Provider } from "mobx-react/native";
import codePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";

//scenes
import {
  Home,
  SearchBrowse,
  Product,
  ProductListStack,
  Login,
  CartSummary,
  Deeplink,
  Information,
  Brands,
  Modal,
  Checkout,
  Settings,
  Deals,

  // forms
  Forms
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
      || (Platform.OS === "ios" && parseInt(DeviceInfo.getBuildNumber()) > 250)
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

    if (prevScreen.routeName !== currentScreen.routeName) {
      // extra events.
      switch (currentScreen.routeName.toLowerCase()) {
        case "productlist":
          if (!currentScreen.params.title) {
            GA.trackEvent("collection", "view", "filter/sort from home");
          } else {
            GA.trackEvent("collection", "view", currentScreen.params.title);
          }
          GA.trackScreen("collection");
          break;
        case "product":
          GA.trackEvent(
            "product",
            "view",
            currentScreen.params.product.title,
            currentScreen.params.product.price
          );
          GA.trackScreen("product");
          break;
        case "modal":
          GA.trackEvent("filter/sort", "open");
          GA.trackScreen("filter/sort");
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
        <View style={{ flex: 1 }}>
          <RootNavigator onNavigationStateChange={this.trackScreen} />
          <GlobalAssistant />
        </View>
      </Provider>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    Product: { screen: Product },
    ProductList: { screen: ProductListStack },
    Checkout: { screen: Checkout },
    CartSummary: { screen: CartSummary },
    Information: { screen: Information },
    Brands: { screen: Brands },

    // forms
    AddressForm: { screen: Forms.AddressForm }
  },
  {
    initialRouteName: "Home",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

const TabNavigator = createTabNavigator(
  {
    Root: { screen: AppNavigator },
    Deals: { screen: Deals },
    SearchBrowse: { screen: SearchBrowse },
    Settings: { screen: Settings }
  },
  {
    tabBarComponent: NavBar,
    tabBarPosition: "bottom",
    lazy: true
  }
);

const RootNavigator = createStackNavigator(
  {
    Deeplink: { screen: Deeplink },
    Login: { screen: Login },
    Modal: { screen: Modal },
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
