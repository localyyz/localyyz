import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  FlatList
} from "react-native";

// third party
import PropTypes from "prop-types";

// custom
import { Styles, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

// local
import ExpandableHeader from "./ExpandableHeader";
import SelectedFilter from "./SelectedFilter";

export default class Common extends React.Component {
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
    selected: "",
    title: ""
  };

  constructor(props) {
    super(props);
    this.state = { collapsed: true };
  }

  onToggle = () => {
    GA.trackEvent("filter/sort", "filter by " + this.props.title);
    this.setState({ collapsed: !this.state.collapsed });
  };

  onSelect = item => {
    this.props.title == "Brand"
      ? GA.trackEvent(
          "filter/sort",
          "filter by " + this.props.title,
          this.props.item
        )
      : "";
    this.setState({ collapsed: true });
    this.props.setFilter(item);
  };

  componentDidUpdate(_, prevState) {
    // TODO: have to track prevState or mobx update + did update
    // will be on a loop
    if (prevState.collapsed && !this.state.collapsed) {
      this.props.asyncFetch();
    }
  }

  // TODO: render sign this is selected
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onSelect(item)}>
        <View style={styles.container}>
          <Text style={styles.label}>{capitalize(item)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onToggle}>
          <ExpandableHeader isOpen={!this.state.collapsed}>
            {this.props.title}
          </ExpandableHeader>
        </TouchableOpacity>
        {!this.state.collapsed || this.props.selected ? (
          <View style={styles.content}>
            {this.props.selected ? (
              <View style={styles.selected}>
                <SelectedFilter
                  ref={`${this.props.title}Filter`}
                  onClear={this.props.clearFilter}>
                  {this.props.selected}
                </SelectedFilter>
              </View>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={this.props.data}
                keyExtractor={item => item}
                renderItem={this.renderItem}/>
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  },

  content: {
    paddingVertical: Sizes.InnerFrame / 2
  },

  label: {
    ...Styles.Text,
    ...Styles.EmphasizedText
  },

  selected: {
    alignItems: "flex-start",
    marginVertical: Sizes.InnerFrame / 2
  }
});
