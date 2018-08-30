import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";

@inject(stores => ({
  searchQuery: stores.searchStore.searchQuery,
  setQuery: stores.searchStore.clearSearch,
  submit: stores.searchStore.reset,
  hasResults: stores.searchStore.hasResults,
  numProducts: stores.searchStore.numProducts
}))
@observer
export default class SearchInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };

    // bindings
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.clear = this.clear.bind(this);
  }

  onSubmitEditing() {
    // use suggested search query since none was given
    //
    // -> setting searchQuery is will trigger a mobx reaction
    // NOTE: see store for detail
    this.props.setQuery(this.state.query);

    // trigger the search
    this.props.submit();

    // callback from parent
    this.props.onSubmit && this.props.onSubmit();
  }

  onChangeText(text) {
    this.setState({
      query: text
    });
  }

  clear() {
    this.onChangeText("");
    this.props.setQuery();
  }

  render() {
    return (
      <View style={styles.container}>
        <MaterialIcon name="search" size={Sizes.Text} color={Colours.Text} />
        <TextInput
          autoCorrect={false}
          returnKeyType="search"
          value={this.state.query}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          underlineColorAndroid={Colours.Transparent}
          placeholder="Search over 200,000 products"
          style={styles.input}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    alignItems: "center",
    borderBottomWidth: Sizes.Spacer,
    borderBottomColor: Colours.SubduedText,
    paddingTop: Sizes.ScreenTop,
    paddingBottom: Sizes.InnerFrame / 2,
    marginLeft: Sizes.InnerFrame,
    marginBottom: Sizes.Height / 12,
    backgroundColor: Colours.Foreground
  },

  input: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText,
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
