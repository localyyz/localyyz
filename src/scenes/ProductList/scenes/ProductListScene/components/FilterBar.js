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
import { withCommas, toPriceString, capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// constants
const SORT_BY = [
  { label: "What's new", value: "created_at" },
  { label: "Price", value: "price", hasDirection: true },
  { label: "Discount (% off)", value: "discount" }
];

@inject(stores => ({
  store: stores.filterStore,
  numProducts: stores.filterStore.numProducts
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
    this.renderSelectedOption = this.renderSelectedOption.bind(this);
  }

  componentDidMount() {
    this.props.isInitialVisible ? this.onPress() : null;
  }

  openFilter() {
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.push("Filter", {
          store: this.props.store
        });
  }

  renderItem({ item: sorter }) {
    return (
      <SortOption
        {...sorter}
        renderSelectedOption={this.renderSelectedOption}/>
    );
  }

  get genderFilter() {
    return !this.props.hideGenderFilter ? (
      <View style={styles.circle}>
        <Filter.Gender />
      </View>
    ) : null;
  }

  renderSelectedOption(
    label,
    onPress,
    isSelected = false,
    hasDirection = false,
    isDescending = false
  ) {
    return (
      <View style={styles.optionContainer}>
        <TouchableOpacity onPress={onPress}>
          <SloppyView>
            <View style={[styles.option, isSelected && styles.selectedOption]}>
              <Text
                style={[
                  styles.optionLabel,
                  styles.optionLabel,
                  isSelected && styles.selectedOptionLabel
                ]}>
                {capitalize(label)}
              </Text>
              {hasDirection && isSelected ? (
                <View style={styles.optionDirection}>
                  <MaterialIcon
                    name={isDescending ? "arrow-downward" : "arrow-upward"}
                    size={Sizes.TinyText}/>
                </View>
              ) : null}
            </View>
          </SloppyView>
        </TouchableOpacity>
      </View>
    );
  }

  get priceFilter() {
    let label;
    if (this.props.store.priceMax >= 300) {
      label = `Over ${toPriceString(this.props.store.priceMin)}`;
    } else if (this.props.store.priceMin && this.props.store.priceMax) {
      label = `${toPriceString(this.props.store.priceMin)} - ${toPriceString(
        this.props.store.priceMax
      )}`;
    } else if (this.props.store.priceMax) {
      label = `Under ${toPriceString(this.props.store.priceMax)}`;
    }

    return label
      ? this.renderSelectedOption(
          label,
          () => this.props.store.setPriceFilter(),
          true
        )
      : null;
  }

  get discountFilter() {
    return this.props.store.discountMin
      ? this.renderSelectedOption(
          `At least ${Math.round(this.props.store.discountMin * 100)}% off`,
          () => this.props.store.setDiscountFilter(),
          true
        )
      : null;
  }

  get brandFilter() {
    return this.props.store.brand
      ? this.renderSelectedOption(
          `Only ${this.props.store.brand}`,
          () => this.props.store.setBrandFilter(),
          true
        )
      : null;
  }

  get colorFilter() {
    return this.props.store.color
      ? this.renderSelectedOption(
          `Only ${this.props.store.color}`,
          () => this.props.store.setColorFilter(),
          true
        )
      : null;
  }

  get sizeFilter() {
    return this.props.store.size
      ? this.renderSelectedOption(
          `Only ${this.props.store.size}`,
          () => this.props.store.setSizeFilter(),
          true
        )
      : null;
  }

  get header() {
    return (
      <View style={Styles.Horizontal}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionHeader}>Filter by</Text>
        </View>
        {this.priceFilter}
        {this.discountFilter}
        {this.brandFilter}
        {this.colorFilter}
        {this.sizeFilter}
        <TouchableOpacity onPress={this.openFilter}>
          <SloppyView>
            <View style={styles.circle}>
              <MaterialIcon
                name="playlist-add"
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
      GA.trackEvent("filter/sort", `sort by ${this.props.value}`);
    } else if (this.props.hasDirection) {
      const sortBy = !this.isDescending ? `-${this.props.value}` : null;
      this.props.setSortBy(sortBy);
      GA.trackEvent("filter/sort", `sort by ${sortBy}`);
    } else {
      this.props.setSortBy();
    }
  }

  render() {
    return this.props.renderSelectedOption(
      this.props.label,
      this.onPress,
      this.isSelected,
      this.props.hasDirection,
      this.isDescending
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
    // marginLeft: Sizes.InnerFrame / 2
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
    ...Styles.Subdued
  },

  selectedOption: {
    backgroundColor: Colours.Action,
    paddingHorizontal: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame / 4
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
    backgroundColor: Colours.Action,
    marginHorizontal: Sizes.InnerFrame / 2
  }
});
