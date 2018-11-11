import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { Provider } from "mobx-react/native";
import { SafeAreaView, withNavigation } from "react-navigation";

import NotfPrompt from "~/src/components/NotfPrompt";

// local
import DealList from "./components/DealList";
import DealsUIStore from "./store";
import DealType from "./components/DealType";

export class DiscountsScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = new DealsUIStore();
  }

  render() {
    return (
      <Provider dealStore={this.store}>
        <SafeAreaView style={styles.container}>
          <View>
            <NotfPrompt
              title="Stay updated on daily deals?"
              promptText="Subscribe Now"/>
            <DealType />
          </View>
          <DealList />
        </SafeAreaView>
      </Provider>
    );
  }
}

export default withNavigation(DiscountsScene);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  }
});
