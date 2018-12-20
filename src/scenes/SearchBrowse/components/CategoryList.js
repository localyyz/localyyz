import React from "react";
import { View, StyleSheet, Text, SectionList } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";

// local
import CategoryButton, { BUTTON_PADDING } from "./CategoryButton";

@inject(stores => ({
  store: stores.searchStore,
  fetch: stores.searchStore.fetchCategories
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

  fetch = () => {
    this.setState({ sections: [] });
    this.props.fetch().then(resolved => {
      if (resolved.categories) {
        this._categories = resolved.categories;
        this.setState({ sections: this._categories.slice(0, 1) });
      }
    });
  };

  renderSection = ({ item, section }) => {
    return (
      <View style={styles.button}>
        <CategoryButton category={item} parent={{ ...section, values: [] }} />
      </View>
    );
  };

  renderSectionHeader = ({ section: category }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{category.label.toUpperCase()}</Text>
      </View>
    );
  };

  renderSectionFooter = () => {
    return <View style={styles.separator} />;
  };

  onEndReached = ({ distanceFromEnd }) => {
    const nextIndex = this.state.sectionIndex + 1;
    if (distanceFromEnd > 0 && nextIndex <= this._categories.length - 1) {
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
        renderItem={this.renderSection}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={
          // number smaller than 1 here means the distance
          // to end is less than 80% of the visible page.
          0.8
        }
        stickySectionHeadersEnabled={false}
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

  button: {
    paddingBottom: BUTTON_PADDING,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground,
    width: Sizes.Width
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
