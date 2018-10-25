import React from "react";
import { View, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";

// custom
import { Colours, NAVBAR_HEIGHT } from "localyyz/constants";

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
        <View style={styles.container}>
          <Header />
          {this.props.shouldOnboard ? <OnboardPrompt /> : <Feed />}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: NAVBAR_HEIGHT,
    backgroundColor: Colours.Foreground
  }
});
