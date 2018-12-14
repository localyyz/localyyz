import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// third party
import { observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";

// local
import CategoryButton, { BUTTON_PADDING } from "./components/CategoryButton";

@observer
export class Category extends React.Component {
  constructor(props) {
    super(props);
    this.category = props.navigation.getParam("category", {});
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.button}>
        <CategoryButton category={item} />
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={[
          { ...this.category, title: `All ${this.category.title}`, toProductList: true },
          ...this.category.values
        ]}
        keyExtractor={item => `cat${item.id}`}
        renderItem={this.renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={styles.list}
        style={styles.container}/>
    );
  }
}

export default withNavigation(Category);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  button: {
    paddingBottom: BUTTON_PADDING,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  list: {
    justifyContent: "center",
    paddingHorizontal: BUTTON_PADDING,
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  }
});
