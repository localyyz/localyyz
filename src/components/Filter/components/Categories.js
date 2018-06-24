import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// local
import Category from "./Category";

@inject(stores => ({
  fetchCategories: stores.filterStore.fetchCategories,
  clearFilter: stores.filterStore.clearCategoryFilter,
  categories: stores.filterStore.categories,
  selected: stores.filterStore.subcategory || stores.filterStore.category
}))
@observer
export default class Categories extends React.Component {
  componentDidMount() {
    this.props.fetchCategories();
  }

  renderItem = ({ item: category }) => {
    return <Category {...category} />;
  };

  render() {
    return (
      <View>
        <Text>By type</Text>
        {this.props.selected ? (
          <View style={styles.row}>
            <Text>selected: {this.props.selected}</Text>
            <TouchableOpacity onPress={this.props.clearFilter}>
              <MaterialIcon
                name="close"
                size={Sizes.Text}
                color={Colours.Text}/>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          scrollEnabled={false}
          data={this.props.categories.slice()}
          keyExtractor={item => item.title}
          renderItem={this.renderItem}
          ListFooterComponent={
            <ActivityIndicator
              style={styles.footer}
              size="small"
              hidesWhenStopped={true}
              animating={!this.props.categories.length}/>
          }
          contentContainerStyle={styles.container}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame / 2
  },

  row: {
    flexDirection: "row"
  },

  footer: {
    paddingVertical: Sizes.InnerFrame / 3
  }
});
