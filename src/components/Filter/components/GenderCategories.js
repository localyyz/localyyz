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
import Accordion from "react-native-collapsible/Accordion";

// custom
import { Colours, Sizes } from "localyyz/constants";

// local
import Category from "./Category";
import Gender from "./Gender";

const GENDER_SECTION = [
  { label: "Women", value: "woman" },
  { label: "Men", value: "man" }
];

@inject(stores => ({
  fetchCategories: stores.filterStore.fetchCategories,
  clearFilter: stores.filterStore.clearCategoryFilter,
  categories: stores.filterStore.categories,
  selected: stores.filterStore.subcategory || stores.filterStore.category,
  gender: stores.filterStore.gender
}))
@observer
export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSection: 0 };
  }

  componentDidMount() {
    this.props.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gender !== this.props.gender) {
      this.setState({ activeSection: this.props.gender == "woman" ? 0 : 1 });
    }
  }

  renderItem = ({ item: category }) => {
    return <Category {...category} />;
  };

  _renderHeader = (content /*index, isActive, sections*/) => {
    return <Gender label={content.label} value={content.value} />;
  };

  _renderContent = (/*content, index, isActive, sections*/) => {
    return (
      <FlatList
        scrollEnabled={false}
        data={this.props.categories.slice()}
        keyExtractor={item => item.title}
        renderItem={this.renderItem}
        ListHeaderComponent={() => {
          return this.props.selected ? (
            <View style={styles.row}>
              <Text>selected: {this.props.selected}</Text>
              <TouchableOpacity onPress={this.props.clearFilter}>
                <MaterialIcon
                  name="close"
                  size={Sizes.Text}
                  color={Colours.Text}/>
              </TouchableOpacity>
            </View>
          ) : null;
        }}
        ListFooterComponent={
          <ActivityIndicator
            style={styles.footer}
            size="small"
            hidesWhenStopped={true}
            animating={!this.props.categories.length}/>
        }
        contentContainerStyle={styles.container}/>
    );
  };

  render() {
    return (
      <View>
        <Text>By category</Text>

        <Accordion
          activeSection={this.state.activeSection}
          sections={GENDER_SECTION}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  row: {
    flexDirection: "row"
  },

  footer: {
    paddingVertical: Sizes.InnerFrame / 3
  }
});
