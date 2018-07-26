import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import PropTypes from "prop-types";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { Filter, SloppyView } from "localyyz/components";
import { withCommas } from "localyyz/helpers";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// local
import Popup from "./Popup";

// constants
const SORT_BY = [
  { label: "What's new", value: "created_at" },
  { label: "Price", value: "price", hasDirection: true },
  { label: "Discount (% off)", value: "discount" }
];

@inject(stores => ({
  store: stores.filterStore,
  numProducts: Math.max(
    0,
    stores.productListStore.numProducts || 0,
    stores.productListStore.products.length
  )
}))
@observer
export class FilterBar extends React.Component {
  static propTypes = {
    isInitialVisible: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    text: "Refine",
    isInitialVisible: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.openFilter = this.openFilter.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.isInitialVisible ? this.onPress() : null;
  }

  openFilter() {
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.navigate("Modal", {
          component: <Popup {...this.props} />
        });
  }

  renderItem({ item: sorter }) {
    return <SortOption {...sorter} />;
  }

  get genderFilter() {
    return !this.props.hideGenderFilter ? (
      <View style={{ marginLeft: Sizes.InnerFrame }}>
        <View style={styles.circle}>
          <Filter.Gender />
        </View>
      </View>
    ) : null;
  }

  get header() {
    return (
      <View style={Styles.Horizontal}>
        <TouchableOpacity onPress={this.openFilter}>
          <SloppyView>
            <View style={styles.circle}>
              <MaterialIcon
                name="sort"
                size={Sizes.Text}
                color={Colours.Text}/>
            </View>
          </SloppyView>
        </TouchableOpacity>
        {this.genderFilter}
        <View style={styles.optionContainer}>
          <Text style={styles.optionHeader}>Sort by</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SORT_BY}
          extraData={this.props.sortBy}
          keyExtractor={(option, i) => `option${i}-${option.value}`}
          contentContainerStyle={styles.content}
          ListHeaderComponent={this.header}
          renderItem={this.renderItem}/>
        <Text style={styles.productCount}>{`${withCommas(
          this.props.numProducts
        )} products`}</Text>
      </View>
    );
  }
}

@inject(stores => ({
  sortBy: stores.filterStore.sortBy,
  setSortBy: stores.filterStore.setSortBy
}))
@observer
class SortOption extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  get isSelected() {
    let parts = this.props.sortBy ? this.props.sortBy.split("-") : [];
    return parts.length > 0 && parts[parts.length - 1] === this.props.value;
  }

  get isDescending() {
    return (
      this.props.sortBy
      && this.props.sortBy.length > 0
      && this.props.sortBy[0] === "-"
    );
  }

  onPress() {
    if (!this.isSelected) {
      this.props.setSortBy(this.props.value);
    } else if (this.props.hasDirection) {
      this.props.setSortBy(!this.isDescending ? `-${this.props.value}` : null);
    } else {
      this.props.setSortBy();
    }
  }

  render() {
    return (
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={this.onPress}>
          <SloppyView>
            <View
              style={[styles.option, this.isSelected && styles.selectedOption]}>
              <Text
                style={[
                  styles.optionLabel,
                  styles.optionLabel,
                  this.isSelected && styles.selectedOptionLabel
                ]}>
                {this.props.label}
              </Text>
              {this.props.hasDirection && this.isSelected ? (
                <View style={styles.optionDirection}>
                  <MaterialIcon
                    name={this.isDescending ? "arrow-downward" : "arrow-upward"}
                    size={Sizes.TinyText}/>
                </View>
              ) : null}
            </View>
          </SloppyView>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(FilterBar);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  content: {
    alignItems: "center",
    paddingHorizontal: Sizes.InnerFrame
  },

  optionContainer: {
    marginLeft: Sizes.InnerFrame / 2
  },

  option: {
    ...Styles.Horizontal,
    ...Styles.RoundedButton,
    marginTop: 1,
    paddingHorizontal: Sizes.InnerFrame / 4,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Transparent
  },

  optionLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  },

  optionDirection: {
    marginLeft: Sizes.InnerFrame / 4
  },

  optionHeader: {
    ...Styles.Subdued,
    marginLeft: Sizes.InnerFrame / 2
  },

  selectedOption: {
    backgroundColor: Colours.Action,
    paddingHorizontal: Sizes.InnerFrame
  },

  selectedOptionLabel: {},

  productCount: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Subdued,
    paddingTop: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  },

  circle: {
    width: Sizes.InnerFrame * 2,
    height: Sizes.InnerFrame * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.Action
  }
});
