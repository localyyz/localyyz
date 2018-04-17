import React from "react";
import { StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import { observer, inject } from "mobx-react";

@inject(stores => {
  const { homeStore: store } = stores;
  return {
    searchActive: store.searchActive,
    searchQuery: store.searchQuery,
    onChangeText: query => (store.searchQuery = query),
    onActivateSearch: () => (store.searchActive = true),
    onClearSearch: () => {
      store.searchActive = false;
      store.searchQuery = "";
      store.searchResults = [];
    }
  };
})
@observer
class SearchInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchFocused: false
    };

    // refs
    this.inputRef = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.searchActive) {
      this.inputRef.current.blur();
    }
    this.setState({ searchFocused: true });
  }

  get renderInputClear() {
    return (
      <TouchableOpacity
        onPress={this.props.onClearSearch}
        hitSlop={{
          top: Sizes.InnerFrame,
          bottom: Sizes.InnerFrame,
          left: Sizes.InnerFrame,
          right: Sizes.InnerFrame
        }}>
        <EntypoIcon
          name={
            this.props.searchActive ? "circle-with-cross" : "magnifying-glass"
          }
          size={Sizes.Text}
          color={Colours.AlternateText}/>
      </TouchableOpacity>
    );
  }

  render() {
    // TODO: for best effect, we should use mobx-forms
    // benefit:
    //   - focus state is controlled via a mobx prop
    //   - observing / modifying said mobx observable will focus/unfocus the
    //   component without resulting to ref blur()/focus() calls
    return (
      <TouchableOpacity
        onPress={() => this.inputRef.current.focus()}
        style={styles.searchContainer}>
        <Text style={styles.searchLabel}>
          {this.props.searchActive && !this.state.searchFocused
            ? "Results For:"
            : "Find"}
        </Text>
        <TextInput
          ref={this.inputRef}
          placeholder="something"
          returnKeyType="search"
          autoCorrect={false}
          placeholderTextColor={Colours.AlternateText}
          value={this.props.searchQuery}
          onChangeText={this.props.onChangeText}
          onEndEditing={() => {
            // do something.
          }}
          onFocus={() => {
            this.setState({ searchFocused: true });
            this.props.onActivateSearch();
          }}
          onBlur={() => this.setState({ searchFocused: false })}
          style={styles.search}/>
        {this.renderInputClear}
      </TouchableOpacity>
    );
  }
}

export default SearchInput;

const styles = StyleSheet.create({
  searchContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame / 2,
    borderBottomWidth: 0.5,
    borderBottomColor: Colours.AlternateText,
    backgroundColor: Colours.Transparent
  },

  searchLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginRight: Sizes.InnerFrame / 4
  },

  search: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Alternate,
    flex: 1
  }
});
