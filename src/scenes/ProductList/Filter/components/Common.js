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
    asyncFetch: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,

    // optional
    //
    // scene name
    scene: PropTypes.string,
    selected: PropTypes.string,
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

  constructor(props) {
    super(props);

    // bindings
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect() {
    GA.trackEvent("filter/sort", "filter by " + this.props.title);
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.push(this.props.scene || "FilterList", {
          ...this.props,
          title: this.props.title || this.props.label,
          filterStore: this.props.filterStore
        });
  }

  get renderSelectedOption() {
    return (
      <View style={[styles.optionContent, styles.selectedOption]}>
        <Text
          style={[styles.optionLabel, styles.selectedOptionLabel]}
          numberOfLines={1}>
          {capitalize(this.props.selected)}
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
            {this.props.selected
              ? this.renderSelectedOption
              : capitalize(this.props.title)}
          </Text>
          {this.props.icon ? (
            <MaterialIcon
              name="playlist-add"
              size={Sizes.Text}
              color={Colours.Text}/>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={this.onSelect}>
        <View style={styles.container}>
          <Text style={styles.headerLabel}>{capitalize(this.props.title)}</Text>
          <View style={styles.selectedValue}>
            <Text style={styles.selectedValueLabel}>
              {capitalize(this.props.selected || "All")}
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
    marginVertical: Sizes.InnerFrame
  },

  option: {
    ...Styles.Horizontal,

    borderRadius: Sizes.RoundedBorders,
    marginTop: 1,
    justifyContent: "space-around",

    flex: 1,
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

  headerLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    fontSize: Sizes.H2
  },

  selectedValueLabel: {
    ...Styles.Text
  }
});
