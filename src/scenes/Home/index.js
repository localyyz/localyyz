import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";

// custom
import { Colours } from "localyyz/constants";

// third party
import { Provider } from "mobx-react/native";

// local
import Store from "./store";

import Header from "./header";
import Feed from "./feed";
import OnboardPrompt from "./components/onboardPrompt";

@inject(stores => ({
  shouldOnboard: stores.userStore.shouldOnboard
}))
@observer
export default class Home extends React.Component {
  static navigationOptions = {
    swipeEnabled: false
  };

  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <Provider homeStore={this.store}>
        {this.props.shouldOnboard ? (
          <OnboardPrompt />
        ) : (
          <SafeAreaView style={styles.container}>
            <Header />
            <Feed />
          </SafeAreaView>
        )}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  }
});
