import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import { observer } from "mobx-react/native";
import Search from "react-native-search-box";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";
import { capitalizeSentence } from "localyyz/helpers";

// local
import Store from "./store";

@observer
export class SearchInputBox extends React.Component {
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
          navigation={this.props.navigation}
          defaultValue={this.store.searchQuery}
          onCancel={() => this.props.navigation.goBack(null)}/>
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
          cancelButtonTextStyle={styles.cancel}
          backgroundColor={Colours.Foreground}/>
      </View>
    );
  }
}

export default withNavigation(SearchInputBox);

const styles = StyleSheet.create({
  container: {
    // NOTE: we are NOT using safeareaview because there
    // are some issue with wrapper header component inside it.
    paddingTop: Sizes.ScreenTop,
    marginBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  cancel: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  input: {
    fontWeight: Sizes.Normal,
    fontSize: Sizes.Text,
    color: Colours.Text,
    backgroundColor: Colours.Input,
    opacity: 0.7,
    height: 36,
    borderRadius: 9
  }
});
