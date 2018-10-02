// third party
import React from "react";
import { createStackNavigator } from "react-navigation";
import { Provider } from "mobx-react/native";

// localyyz
import ProductScene from "~/src/scenes/Product";
import ProductListStack from "~/src/scenes/ProductList";

// local
import Store from "./store";
import Question from "./question";
import Merchant from "./merchant";

const OnboardingStack = createStackNavigator(
  {
    Question: { screen: Question },
    PickMerchant: { screen: Merchant },
    Product: { screen: ProductScene },
    ProductList: { screen: ProductListStack }
  },
  {
    initialRouteName: "Question",
    navigationOptions: ({ navigation: navigationOptions }) => ({
      ...navigationOptions,
      header: null
    })
  }
);

export default class Onboarding extends React.Component {
  static router = OnboardingStack.router;

  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <Provider onboardingStore={this.store}>
        <OnboardingStack navigation={this.props.navigation} />
      </Provider>
    );
  }
}
