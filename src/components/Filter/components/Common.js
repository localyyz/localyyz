import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { inject } from "mobx-react/native";

// custom
import { Styles, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

@inject(stores => ({
  filterStore: stores.filterStore
}))
export class Common extends React.Component {
  static propTypes = {
    asyncFetch: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    data: PropTypes.object,
    selected: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    data: [],
    selected: "All",
    title: ""
  };

  constructor(props) {
    super(props);

    // bindings
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect() {
    GA.trackEvent("filter/sort", "filter by " + this.props.title);
    this.props.navigation.push("FilterList", {
      ...this.props,
      filterStore: this.props.filterStore
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onSelect}>
        <View style={styles.container}>
          <Text style={styles.headerLabel}>{this.props.title}</Text>
          <View style={styles.selectedValue}>
            <Text style={styles.selectedValueLabel}>
              {capitalize(this.props.selected)}
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

  headerLabel: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  selectedValueLabel: {
    ...Styles.Text
  }
});
