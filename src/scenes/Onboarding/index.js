// third party
import React from "react";
import { createStackNavigator } from "react-navigation";
import { Provider } from "mobx-react/native";

// local
import Store from "./store";
import QuestionScene from "./questions";

const OnboardingStack = createStackNavigator(
  {
    Personalize: { screen: QuestionScene }
  },
  {
    initialRouteName: "Personalize",
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
