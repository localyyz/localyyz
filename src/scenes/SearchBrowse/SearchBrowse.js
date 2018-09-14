import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { Provider, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours } from "localyyz/constants";

// local
import { CategoryList } from "./components";
import SearchInputBox from "./SearchInput";
import Store from "./store";

@observer
export class Search extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: <SearchInputBox navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <Provider searchStore={this.store}>
        <View style={styles.container}>
          <View style={styles.landing}>
            <CategoryList />
          </View>
        </View>
      </Provider>
    );
  }
}

export default withNavigation(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  landing: {
    flex: 1,
    backgroundColor: Colours.Foreground
  }
});
