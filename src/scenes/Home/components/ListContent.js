import React from "react";
import { StyleSheet, View } from "react-native";

// custom
import { Sizes } from "localyyz/constants";
import { ProductTile } from "localyyz/components";

// third party
//import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";

export class ListItem React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <View style={styles.tile}>
        <ProductTile
          backgroundColor={this.props.backgroundColor}
          onPress={() =>
            this.props.navigation.push("Product", {
              product: this.props.product
            })
          }
          product={this.props.product}/>
      </View>
    );
  }
}

export default withNavigation(ListItem);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
