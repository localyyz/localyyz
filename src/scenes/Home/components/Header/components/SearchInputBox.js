import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react";

@inject(stores => ({
  searchQuery: stores.homeStore.searchQuery,
  onChangeText: query => (stores.homeStore.searchQuery = query),

  // suggestions
  currentSuggestion:
    stores.homeStore.searchSuggestions[stores.homeStore.currentSuggestion]
}))
@observer
export default class SearchInputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };

    // refs
    this.ref = React.createRef();

    // bindings
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.focus = this.focus.bind(this);
  }

  onSubmitEditing() {
    // use suggested search query since none was given
    if (!this.props.searchQuery) {
      this.props.onChangeText(this.props.currentSuggestion);
    }
  }

  focus() {
    this.ref.current && this.ref.current.focus();
  }

  setEditMode(on) {
    this.setState({
      isEditing: on != null ? on : !this.state.isEditing
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.isEditing || !nextState.isEditing;
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoFocus
          autoCorrect={false}
          ref={this.ref}
          returnKeyType="search"
          value={this.props.searchQuery}
          onFocus={() => this.setEditMode(true)}
          onEndEditing={() => this.setEditMode(false)}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          style={styles.input}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    marginLeft: Sizes.InnerFrame * 3.5
  },

  input: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    paddingRight: Sizes.InnerFrame * 2
  }
});