import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import { NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { observer, inject, Provider } from "mobx-react";

// local
import { Main, Header, Search } from "./components";
import Store from "./store";

@inject("loginStore")
@observer
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store(this.props.loginStore);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { navigation: { state } } = nextProps;
    if (state.params && state.params.reset) {
      // this resets the search + search results
      // this.clearSearch()
    }
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
