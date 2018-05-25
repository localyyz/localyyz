import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import { NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { observer, Provider } from "mobx-react/native";

// local
import { Main, Header, Search } from "./components";
import Store from "./store";

@observer
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    StatusBar.setBarStyle("light-content", true);

    return (
      <Provider homeStore={this.store}>
        <View style={styles.container}>
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
