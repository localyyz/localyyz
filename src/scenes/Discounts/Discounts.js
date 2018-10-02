import React from "react";
import { StyleSheet, View } from "react-native";
// third party
import { Provider } from "mobx-react/native";
import { withNavigation } from "react-navigation";
// custom
import { Colours, Sizes } from "localyyz/constants";
// local
import { DealList, Header } from "./components";
import DealsUIStore from "./store";
import { NAVBAR_HEIGHT } from "../../constants";

export class DiscountsScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = new DealsUIStore();
  }

  render() {
    return (
      <Provider dealStore={this.store}>
        <View style={styles.container}>
          <DealList />
        </View>
      </Provider>
    );
  }
}

export default withNavigation(DiscountsScene);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Sizes.ScreenTop
  }
});
