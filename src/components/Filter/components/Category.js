import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// localyyz
import { Styles, Sizes } from "localyyz/constants";
import { ApiInstance } from "localyyz/global";

// third party
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { lazyObservable } from "mobx-utils";
import { inject, observer } from "mobx-react/native";

@inject(stores => ({
  filterParams: stores.filterStore.params
}))
@observer
export class Category extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    fetchPath: PropTypes.string.isRequired,
    filterParams: PropTypes.object
  };

  static defaultProps = {
    title: "",
    filterParams: {}
  };

  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  lazyCategories = () => {
    return lazyObservable(sink =>
      ApiInstance.get(this.props.fetchPath).then(resp => sink(resp))
    );
  };

  onPress() {
    this.props.navigation.navigate("ProductList", {
      ...this.props,
      fetchPath: `${this.props.fetchPath}/products`,
      categories: this.lazyCategories()
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.label}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Category);

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 6
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText
  }
});
