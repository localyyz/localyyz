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
  shouldOnboard: stores.userStore.shouldOnboard,
  shouldOnboardRightAway: stores.userStore.shouldOnboardRightAway,
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

  render() {
    return (
      <Provider homeStore={this.store}>
        {this.props.shouldOnboard ? (
          <OnboardPrompt
            key={this.props.userId}
            shouldOnboardRightAway={this.props.shouldOnboardRightAway}/>
        ) : (
          <SafeAreaView style={styles.container}>
            <Header />
            <NotfPrompt
              dismissAfter={5000}
              title="Want the latest fashion curated just for you?"
              promptText="Sure, why not."/>
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
