import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { observer } from "mobx-react/native";
import Search from "react-native-search-box";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";
import { capitalizeSentence } from "localyyz/helpers";

// local
import Store from "./store";

@observer
export default class SearchInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  onSubmitEditing = text => {
    // update the search query
    this.store.setQuery(text);

    // trigger the search
    this.store.reset();

    // navigate
    this.props.navigation.push("ProductList", {
      store: this.store,
      title: capitalizeSentence(this.store.searchQuery),
      header: (
        <SearchInputBox
          defaultValue={this.store.searchQuery}
          onCancel={() => this.props.navigation.goBack(null)}
          navigation={this.props.navigation}/>
      )
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Search
          {...this.props}
          onSearch={this.onSubmitEditing}
          inputStyle={styles.input}
          inputHeight={Sizes.SearchBarHeight}
          cancelButtonTextStyle={styles.cancel}
          backgroundColor={Colours.Foreground}/>;
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.ScreenTop
  },

  cancel: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  input: {
    fontWeight: Sizes.Normal,
    fontSize: Sizes.Text,
    color: Colours.Text
  }
});
