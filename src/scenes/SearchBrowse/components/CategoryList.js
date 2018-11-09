import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList
} from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";

// local
import CategoryButton, { BUTTON_PADDING } from "./CategoryButton";
import CategoryGender from "./CategoryGender";

// constants
const CATEGORY_PRODUCT_LIST_KEY = "categoryProductList";

@inject(stores => ({
  store: stores.searchStore,
  fetch: stores.searchStore.fetchCategories,
  gender: stores.searchStore.gender && stores.searchStore.gender.id,
  setGender: stores.searchStore.setGender
}))
@observer
export class CategoryList extends React.Component {
  constructor(props) {
    super(props);

    // -> this is the cached section
    this._categories = [];
    this.state = {
      sections: [],
      sectionIndex: 0
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gender && prevProps.gender !== this.props.gender) {
      this.fetch();
    }
  }

  fetch = () => {
    this.props.fetch().then(resolved => {
      if (resolved.categories) {
        this._categories = resolved.categories;
        this.setState({ sections: this._categories.slice(0, 1) });
      }
    });
  };

  buildParams = category => {
    return {
      fetchPath: `categories/${category.id}/products`,
      title: category.title,
      gender: this.props.gender,
      category: category
    };
  };

  // this selects a category from the main search browse screen
  onSelectCategory = category => {
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams(category),
      key: `${CATEGORY_PRODUCT_LIST_KEY}-${category.id}`
    });
  };

  renderSection = ({ section, index }) => {
    // NOTE: this is a hack version of numcolumns = 2 with sectioned list

    // skip the odd number columns because it was
    // already handled by even numbered once
    if (index % 2 > 0) return null;

    const rowItems = [section.data[index]];
    if (index + 1 < section.data.length) {
      rowItems.push(section.data[index + 1]);
    }

    return (
      <View
        key={"row-" + rowItems.map(d => d.id).join("-")}
        style={{
          paddingBottom: BUTTON_PADDING,
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
        {rowItems.map(d => (
          <CategoryButton
            key={`cat-${d.id}`}
            imageUrl={d.imageUrl}
            title={d.title}
            onPress={() => this.onSelectCategory(d)}/>
        ))}
      </View>
    );
  };

  renderSectionHeader = ({ section: category }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onSelectCategory(category)}>
        <View style={styles.header}>
          <Text style={styles.title}>{category.title.toUpperCase()}</Text>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>View all</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSectionFooter = () => {
    return <View style={styles.separator} />;
  };

  renderHeader = () => {
    return (
      <CategoryGender
        key={`gender-${this.props.gender.id}`}
        setGender={this.props.setGender}
        gender={this.props.gender}/>
    );
  };

  onEndReached = ({ distanceFromEnd }) => {
    const nextIndex = this.state.sectionIndex + 1;
    if (distanceFromEnd > 0 && this._categories.length - 1 > nextIndex) {
      // not the last page.
      const nextSection = this._categories[nextIndex];
      this.setState({
        sectionIndex: nextIndex,
        sections: [...this.state.sections, nextSection]
      });
    }
  };

  render() {
    return (
      <SectionList
        sections={this.state.sections}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderSection}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={
          // number smaller than 1 here means the distance
          // to end is less than 80% of the visible page.
          0.8
        }
        scrollEventThrottle={16}
        initialNumToRender={1}
        contentContainerStyle={styles.list}
        style={styles.container}/>
    );
  }
}

export default withNavigation(CategoryList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
    //marginHorizontal: BUTTON_PADDING
    //paddingTop: Sizes.ScreenTop + Sizes.OuterFrame
  },

  list: {
    justifyContent: "center",
    paddingHorizontal: BUTTON_PADDING,
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  separator: {
    paddingTop: BUTTON_PADDING,
    paddingBottom: Sizes.InnerFrame,
    borderColor: Colours.Background,
    borderBottomWidth: 1,
    width: Sizes.Width
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground,
    width: Sizes.Width
  },

  title: {
    ...Styles.Text
  },

  button: {
    ...Styles.RoundedButton,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Action
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.TinyText
  }
});
