import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity
} from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage, SloppyView } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import EntypoIcon from "react-native-vector-icons/Entypo";

// local
import ExpandableSection from "./ExpandableSection";

@inject(stores => ({
  placeName:
    stores.productStore.product && stores.productStore.product.place.name,
  placeId: stores.productStore.product && stores.productStore.product.place.id,
  placeLogo:
    stores.productStore.product && stores.productStore.product.place.imageUrl,
  returnPolicy:
    stores.productStore.product && stores.productStore.product.returnPolicy,
  shippingPolicy:
    stores.productStore.product && stores.productStore.product.shippingPolicy,
  isSocial: stores.productStore.product && stores.productStore.product.isSocial,
  facebookUrl:
    stores.productStore.product
    && stores.productStore.product.place.facebookUrl,
  instagramUrl:
    stores.productStore.product
    && stores.productStore.product.place.instagramUrl
}))
@observer
export class MerchantDetails extends React.Component {
  static propTypes = {
    isBrowsingDisabled: PropTypes.bool,

    // mobx injected
    placeName: PropTypes.string,
    placeLogo: PropTypes.string,
    returnPolicy: PropTypes.object,
    shippingPolicy: PropTypes.object,
    isSocial: PropTypes.bool,
    facebookUrl: PropTypes.string,
    instagramUrl: PropTypes.string
  };

  static defaultProps = {
    isBrowsingDisabled: false,
    placeName: "",
    isSocial: false
  };

  get renderSocial() {
    return this.props.isSocial ? (
      <View style={styles.socialContainer}>
        {this.props.facebookUrl ? (
          <EntypoIcon
            name="facebook-with-circle"
            color={Colours.Secondary}
            size={Sizes.IconButton}
            onPress={() => Linking.openURL(this.props.facebookUrl)}
            style={styles.socialIcon}/>
        ) : null}
        {this.props.instagramUrl ? (
          <EntypoIcon
            name="instagram-with-circle"
            color={Colours.Primary}
            size={Sizes.IconButton}
            onPress={() => Linking.openURL(this.props.instagramUrl)}
            style={styles.socialIcon}/>
        ) : null}
      </View>
    ) : null;
  }

  get renderShippingPolicy() {
    return this.props.shippingPolicy ? (
      <ExpandableSection
        title="Shipping"
        content={this.props.shippingPolicy.desc}
        onExpand={
          this.props.shippingPolicy.url
            ? () => Linking.openURL(this.props.shippingPolicy.url)
            : null
        }/>
    ) : null;
  }

  get renderReturnPolicy() {
    return this.props.returnPolicy ? (
      <ExpandableSection
        title="Return policy"
        content={this.props.returnPolicy.desc}
        onExpand={
          this.props.returnPolicy.url
            ? () => Linking.openURL(this.props.returnPolicy.url)
            : null
        }/>
    ) : null;
  }

  get touchableComponent() {
    return this.props.isBrowsingDisabled ? View : TouchableOpacity;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>About the merchant</Text>
        </View>
        <View style={styles.banner}>
          <View style={styles.bannerHeader}>
            <this.touchableComponent
              onPress={() =>
                this.props.navigation.push("ProductList", {
                  fetchPath: `places/${this.props.placeId}/products`,
                  title: capitalize(this.props.placeName)
                })
              }>
              <SloppyView>
                <Text style={styles.bannerHeaderTitle}>
                  {this.props.placeName}
                </Text>
              </SloppyView>
            </this.touchableComponent>
            {this.renderSocial}
          </View>
          {this.props.placeLogo ? (
            <this.touchableComponent
              onPress={() =>
                this.props.navigation.push("ProductList", {
                  fetchPath: `places/${this.props.placeId}/products`,
                  title: capitalize(this.props.placeName)
                })
              }>
              <SloppyView>
                <ConstrainedAspectImage
                  constrainHeight={Sizes.Width / 8}
                  constrainWidth={Sizes.Width / 3}
                  source={{ uri: this.props.placeLogo }}/>
              </SloppyView>
            </this.touchableComponent>
          ) : null}
        </View>
        {this.renderShippingPolicy}
        {this.renderReturnPolicy}
      </View>
    );
  }
}

export default withNavigation(MerchantDetails);

const styles = StyleSheet.create({
  container: {},

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginVertical: Sizes.InnerFrame / 2
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  banner: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginVertical: Sizes.InnerFrame / 2
  },

  bannerHeader: {
    flex: 1
  },

  bannerHeaderTitle: {
    ...Styles.Text,
    ...Styles.Title,
    flexWrap: "wrap",
    marginBottom: Sizes.InnerFrame
  },

  // social
  socialContainer: {
    ...Styles.Horizontal
  },

  socialIcon: {
    marginRight: Sizes.InnerFrame / 2
  }
});
