import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import { NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider } from "mobx-react/native";

// local
import { Main, Header, Search } from "./components";
import Store from "./store";

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
          <StatusBar barStyle="light-content" />
          <Main />
          <Search />
          <Header />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: NAVBAR_HEIGHT
  }
});
