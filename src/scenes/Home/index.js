import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { observer, inject, Provider } from "mobx-react/native";

// custom
import { Colours } from "localyyz/constants";
import NotfPrompt from "~/src/components/NotfPrompt";

// local
import Store from "./store";

import Header from "./header";
import Feed from "./feed";
import OnboardPrompt from "./components/onboardPrompt";

@inject(stores => ({
  shouldUserOnboard: stores.userStore.shouldOnboard,
  shouldPersonalize: stores.userStore.shouldPersonalize,
  userId: stores.userStore.id
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

  componentDidMount() {
    if (this.props.shouldUserOnboard) {
      this.props.navigation.navigate("Onboard");
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.shouldUserOnboard && this.props.shouldUserOnboard) {
      this.props.navigation.navigate("Onboard");
    }
  }

  render() {
    return (
      <Provider homeStore={this.store}>
        {this.props.shouldPersonalize ? (
          <OnboardPrompt key={this.props.userId} />
        ) : (
          <SafeAreaView style={styles.container}>
            <Header />
            <NotfPrompt
              dismissAfter={10000}
              title="Want the latest fashion curated just for you?"
              promptText="Sure, Update me."/>
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
