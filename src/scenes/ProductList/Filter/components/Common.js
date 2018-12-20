import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

@inject(stores => ({
  filterStore: stores.filterStore
}))
@observer
export class Common extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    setFilter: PropTypes.func.isRequired,
    // optional
    //
    // scene name
    asyncFetch: PropTypes.func,
    clearFilter: PropTypes.func,
    scene: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    isButton: PropTypes.bool // render as inline button
  };

  static defaultProps = {
    data: [],
    title: "",
    isButton: false,
    icon: null
  };

  onSelect = () => {
    GA.trackEvent("filter/sort", "filter by " + this.props.title);
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.push(this.props.scene || "FilterList", {
          ...this.props,
          title: this.props.title || this.props.label,
          filterStore: this.props.filterStore
        });
  };

  get selected() {
    return (this.props.filterStore[this.props.id] || []).slice();
  }

  get renderSelectedOption() {
    return (
      <View style={[styles.optionContent, styles.selectedOption]}>
        <Text
          style={[styles.optionLabel, styles.selectedOptionLabel]}
          numberOfLines={1}>
          {this.selected.length > 1
            ? `${capitalize(this.selected[0])} (${this.selected.length
                - 1} more)`
            : capitalize(this.selected)}
        </Text>
      </View>
    );
  }

  render() {
    return this.props.isButton ? (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={this.onSelect}
        hitSlop={{
          top: Sizes.InnerFrame * 2,
          bottom: Sizes.InnerFrame * 2,
          left: Sizes.InnerFrame,
          right: Sizes.InnerFrame
        }}>
        <View style={[styles.option]}>
          <Text
            style={[styles.optionLabel]}
            testID={`filter${this.props.id}`}
            numberOfLines={1}>
            {this.selected.length > 1
              ? this.renderSelectedOption
              : capitalize(this.props.title)}
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={this.onSelect}>
        <View style={styles.container}>
          <Text style={styles.typeLabel}>{capitalize(this.props.title)}</Text>
          <View style={styles.selectedValue}>
            <Text style={styles.selectedValueLabel}>
              {this.selected.length > 1
                ? `${capitalize(this.selected[0])} (${this.selected.length
                    - 1} more)`
                : capitalize(this.selected) || "All"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Common);

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: Colours.Border
  },

  option: {
    ...Styles.Horizontal,
    flex: 1,

    borderRadius: Sizes.RoundedBorders,
    marginTop: 1,
    justifyContent: "space-around",

    height: Sizes.Button,
    marginHorizontal: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Action
  },

  optionContent: {
    ...Styles.Horizontal,
    justifyContent: "center",

    width: Sizes.Width / 4,
    height: Sizes.Button
  },

  optionLabel: {
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  selectedOption: {
    ...Styles.Horizontal,
    justifyContent: "center",

    width: Sizes.Width / 4,
    height: Sizes.Button
  },

  selectedOptionLabel: {
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  typeLabel: {
    ...Styles.SmallText
  },

  selectedValueLabel: {
    ...Styles.SmallText,
    ...Styles.Emphasized
  }
});
