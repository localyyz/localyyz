import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { LiquidImage, UppercasedText } from "localyyz/components";
import { toPriceString } from "localyyz/helpers";
import { RelatedItem } from "./components";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";

@withNavigation
@inject(stores => ({
  image:
    stores.productStore.product
    && stores.productStore.product.images
    && stores.productStore.product.images.length > 0
      ? stores.productStore.product.images[0]
      : null,
  place: stores.productStore.product && stores.productStore.product.place,
  title:
    stores.productStore.product && stores.productStore.product.truncatedTitle,
  currency:
    stores.productStore.product
    && stores.productStore.product.place
    && stores.productStore.product.place.currency,
  size:
    stores.productStore.selectedVariant
    && stores.productStore.selectedVariant.etc.size
    && `${stores.productStore.selectedVariant.etc.size} - `,
  color:
    stores.productStore.selectedVariant
    && stores.productStore.selectedVariant.etc.color
    && `${stores.productStore.selectedVariant.etc.color} - `,
  price:
    stores.productStore.selectedVariant
    && stores.productStore.selectedVariant.price,
  relatedProducts: stores.productStore.relatedProducts.slice() || [],
  isAddedSummaryVisible: stores.productStore.isAddedSummaryVisible,
  closeAddedSummary: () => stores.productStore.toggleAddedSummary(false),
  showCart: () => stores.navbarStore.togglePullup(true),
  showNavbar: () => stores.navbarStore.show()
}))
@observer
export default class AddedSummary extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    relatedProducts: PropTypes.array.isRequired,
    closeAddedSummary: PropTypes.func.isRequired,
    showCart: PropTypes.func.isRequired,
    showNavbar: PropTypes.func.isRequired,
    image: PropTypes.object,
    place: PropTypes.object,
    title: PropTypes.string,
    currency: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    price: PropTypes.number
  };

  static defaultProps = {
    size: "",
    color: "",
    price: 0,
    currency: "USD",
    title: "",
    place: {}
  };

  constructor(props) {
    super(props);

    // bindings
    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(callback) {
    this.props.closeAddedSummary();

    // callback to revert back to cart open on back
    callback && callback();
  }

  render() {
    return this.props.isAddedSummaryVisible ? (
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        duration={300}
        style={styles.container}>
        <View style={styles.summary}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.summaryContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Added to cart</Text>
              <Animatable.View animation="bounceIn" delay={900}>
                <Icon
                  color={Colours.Success}
                  size={Sizes.IconButton}
                  name="check-circle"/>
              </Animatable.View>
            </View>
            <View style={styles.itemContainer}>
              <View>
                {this.props.image ? (
                  <LiquidImage
                    square
                    resizeMode="cover"
                    crop="bottom"
                    w={Sizes.SquareButton}
                    style={styles.photo}
                    source={{
                      uri: this.props.image.imageUrl
                    }}/>
                ) : (
                  <View style={styles.photo} />
                )}
              </View>
              <View style={styles.description}>
                <Text style={styles.itemTitle}>{this.props.title}</Text>
                <Text style={styles.details}>
                  {`${this.props.size}${this.props.color}${toPriceString(
                    this.props.price,
                    this.props.currency
                  )}`}
                </Text>
              </View>
            </View>
            {this.props.relatedProducts.length > 0 ? (
              <View style={styles.header}>
                <Text style={styles.title}>Check these out too</Text>
                <Animatable.View animation="bounceIn" delay={800}>
                  <TouchableOpacity
                    onPress={() => {
                      this.onDismiss();
                      this.props.navigation.navigate("ProductList", {
                        fetchPath: `/places/${this.props.place.id}/products`,
                        title: this.props.place.name
                      });
                    }}>
                    <Text style={styles.moreButton}>view more</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            ) : null}
            <View style={styles.summaryRelatedContainer}>
              {this.props.relatedProducts.map(product => (
                // TODO: FlatList
                <RelatedItem
                  key={`summary-related-${product.id}`}
                  product={product}/>
              ))}
            </View>
          </ScrollView>
          <LinearGradient
            colors={[Colours.BlackTransparent, Colours.DarkTransparent]}
            style={styles.gradient}/>
          <View style={[Styles.Card, styles.card, styles.cartButtons]}>
            <TouchableOpacity
              onPress={() => this.onDismiss(this.props.showCart)}>
              <View style={Styles.RoundedButton}>
                <UppercasedText style={styles.addButtonLabel}>
                  View your cart
                </UppercasedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onDismiss()}
              style={styles.dismissButton}>
              <EntypoIcon
                color={Colours.AlternateText}
                size={Sizes.Oversized}
                name="chevron-with-circle-down"/>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  summary: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: Sizes.OuterFrame * 2,
    backgroundColor: Colours.StatusBar
  },

  gradient: {
    height: Sizes.InnerFrame * 2,
    marginTop: -Sizes.InnerFrame * 2
  },

  title: {
    ...Styles.Text,
    ...Styles.Alternate,
    ...Styles.SectionTitle
  },

  itemContainer: {
    ...Styles.Card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: Sizes.InnerFrame
  },

  summaryRelatedContainer: {
    ...Styles.Card,
    paddingVertical: 0,
    marginVertical: 0,
    backgroundColor: Colours.Transparent
  },

  description: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  },

  photo: {
    backgroundColor: Colours.MenuBackground
  },

  header: {
    ...Styles.EqualColumns,
    alignItems: "center",
    marginRight: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 2,
    paddingTop: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Transparent
  },

  itemTitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.BottomHalfSpacing,
    fontSize: Sizes.H3
  },

  details: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.SmallText
  },

  moreButton: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Terminal,
    ...Styles.Alternate,
    textDecorationLine: "underline",
    marginRight: Sizes.InnerFrame / 2
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  // cart buttons (on add screen)
  cartButtons: {
    marginBottom: 0,
    paddingBottom: 0,
    backgroundColor: Colours.Transparent,
    alignItems: "center"
  },

  dismissButton: {
    marginTop: Sizes.InnerFrame
  }
});
