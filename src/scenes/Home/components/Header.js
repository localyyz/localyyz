import React from "react";
import { StyleSheet, View } from "react-native";

// third party
import { inject } from "mobx-react";

// custom
import { Colours, Sizes } from "localyyz/constants";

// local
import AssistantHeader from "./AssistantHeader";
import SearchInput from "./SearchInput";

@inject(stores => ({
  onLayout: e => (stores.homeStore.headerHeight = e.nativeEvent.layout.height)
}))
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View onLayout={this.props.onLayout} style={styles.header}>
        <AssistantHeader />
        <SearchInput />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.OuterFrame * 2,
    backgroundColor: Colours.MenuBackground
  }
});

export default Header;
