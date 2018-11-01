import React from "react";
import { StyleSheet } from "react-native";
// third party
import { Provider } from "mobx-react/native";
import { SafeAreaView, withNavigation } from "react-navigation";
// local
import { DealList } from "./components";
import DealsUIStore from "./store";

export class DiscountsScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = new DealsUIStore();
  }

  render() {
    return (
      <Provider dealStore={this.store}>
        <SafeAreaView style={styles.container}>
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
