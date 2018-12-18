import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { observer, Provider } from "mobx-react/native";

// custom
import { Colours } from "localyyz/constants";
import NotfPrompt from "~/src/components/NotfPrompt";

// local
import Store from "./store";

import Header from "./header";
import Feed from "./feed";

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
        <SafeAreaView style={styles.container}>
          <Header />
          {this.store.showNotfPrompt && (
            <NotfPrompt
              dismissAfter={10000}
              title="Want the latest fashion curated just for you?"
              promptText="Sure, Update me."/>
          )}
          <Feed />
        </SafeAreaView>
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
