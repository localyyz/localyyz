import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  FlatList
} from "react-native";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

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
    this.setState({ collapsed: !this.state.collapsed });
  };

  onSelect = item => {
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
      <View>
        <TouchableOpacity onPress={this.onToggle}>
          <View>
            <Text>by {this.props.title}</Text>
          </View>
        </TouchableOpacity>
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

        {!this.state.collapsed ? (
          <FlatList
            scrollEnabled={false}
            data={this.props.data}
            keyExtractor={item => item}
            renderItem={this.renderItem}
            ListFooterComponent={
              <ActivityIndicator
                style={styles.footer}
                size="small"
                hidesWhenStopped={true}
                animating={!this.props.data.length}/>
            }
            contentContainerStyle={styles.container}/>
        ) : null}
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

  label: {
    ...Styles.Text,
    ...Styles.EmphasizedText
  }
});
