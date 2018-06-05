import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { LiquidImage } from "localyyz/components";
import { randInt, toPriceString } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import * as Animatable from "react-native-animatable";

@withNavigation
@inject(stores => ({
  closeAddedSummary: () => stores.productStore.toggleAddedSummary(false)
}))
export default class RelatedItem extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    product: PropTypes.object.isRequired,

    // mobx injected
    closeAddedSummary: PropTypes.func.isRequired
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.closeAddedSummary();
          this.props.navigation.navigate("Product", {
            product: this.props.product
          });
        }}>
        <Animatable.View
          animation="fadeInRight"
          delay={randInt(400) + 400}
          duration={300}
          style={styles.container}>
          {this.props.product.images && this.props.product.images.length > 0 ? (
            <LiquidImage
              square
              w={Sizes.SquareButton * 2 / 3}
              resizeMode="contain"
              crop="bottom"
              style={styles.photo}
              source={{
                uri: this.props.product.images[0].imageUrl
              }}/>
          ) : (
            <View style={styles.photo} />
          )}
          <View style={styles.description}>
            <Text style={styles.title}>
              {this.props.product.truncatedTitle}
            </Text>
            <View style={Styles.Horizontal}>
              <Text style={styles.price}>
                {toPriceString(
                  this.props.product.variants[0].price,
                  this.props.product.place.currency
                )}
              </Text>
              {this.props.product.variants[0].prevPrice
              && this.props.product.variants[0].prevPrice > 0 ? (
                <Text style={styles.prevPrice}>
                  {this.props.product.variants[0].prevPrice.toFixed(2)}
                </Text>
              ) : null}
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Card,
    ...Styles.Horizontal,
    justifyContent: "flex-start",
    paddingVertical: Sizes.InnerFrame / 2,
    marginVertical: Sizes.InnerFrame / 8,
    marginHorizontal: null,
    margin: 0,
    padding: 0,
    backgroundColor: Colours.Transparent
  },

  description: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  },

  photo: {
    backgroundColor: Colours.Foreground
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    fontSize: Sizes.H3,
    marginBottom: Sizes.InnerFrame / 2
  },

  price: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate,
    ...Styles.SmallText
  },

  prevPrice: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.SmallText,
    ...Styles.Subdued,
    fontWeight: Styles.Light,
    textDecorationLine: "line-through",
    marginLeft: Sizes.InnerFrame / 2
  }
});
