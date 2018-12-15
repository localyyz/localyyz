import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView
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
import ShippingPolicy from "./ShippingPolicy";

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
    placeName: "",
    isSocial: false
  };

  get renderSocial() {
    return this.props.isSocial ? (
      <View style={styles.socialContainer}>
        {this.props.facebookUrl ? (
          <EntypoIcon.Button
            name="facebook-with-circle"
            color={Colours.Secondary}
            backgroundColor={Colours.Transparent}
            underlayColor={Colours.Transparent}
            size={Sizes.SocialButton}
            onPress={() => Linking.openURL(this.props.facebookUrl)}
            style={styles.socialIcon}/>
        ) : null}
        {this.props.instagramUrl ? (
          <EntypoIcon.Button
            name="instagram-with-circle"
            color={Colours.Primary}
            backgroundColor={Colours.Transparent}
            underlayColor={Colours.Transparent}
            size={Sizes.SocialButton}
            onPress={() => Linking.openURL(this.props.instagramUrl)}
            style={styles.socialIcon}/>
        ) : null}
      </View>
    ) : null;
  }

  get renderShippingPolicy() {
    return (
      <ExpandableSection
        title="Shipping policy"
        content={"View Shipping Info"}
        onExpand={() => {
          this.props.navigation.navigate("Modal", {
            type: "shipping policy",
            component: <ShippingPolicy placeId={this.props.placeId} />
          });
        }}/>
    );
  }

  get renderReturnPolicy() {
    const returnPolicyFn = () => {
      this.props.returnPolicy && this.props.returnPolicy.desc.length > 0
        ? this.props.navigation.navigate("Modal", {
            type: "return policy",
            component: (
              <ScrollView
                contentContainerStyle={{
                  padding: Sizes.OuterFrame,
                  paddingTop: Sizes.ScreenTop,
                  marginBottom: Sizes.ScreenBottom
                }}>
                <View>
                  <Text>{this.props.returnPolicy.full}</Text>
                  {this.props.returnPolicy.url ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(this.props.returnPolicy.url)
                      }>
                      <View
                        style={{
                          ...Styles.RoundedButton,
                          marginTop: Sizes.InnerFrame,
                          height: Sizes.InnerFrame * 2,
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                        <Text
                          style={[
                            styles.Text,
                            styles.Emphasized,
                            { color: Colours.ButtonLabel }
                          ]}>
                          Read more
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </ScrollView>
            )
          })
        : this.props.returnPolicy.url
          ? () => Linking.openURL(this.props.returnPolicy.url)
          : null;
    };

    return this.props.returnPolicy ? (
      <ExpandableSection
        title="Return policy"
        content={this.props.returnPolicy.desc}
        onExpand={returnPolicyFn}/>
    ) : null;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderShippingPolicy}
        {this.renderReturnPolicy}
      </View>
    );
  }
}

export default withNavigation(MerchantDetails);

const styles = StyleSheet.create({
  container: {},

  banner: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginVertical: Sizes.InnerFrame / 2
  },

  bannerHeader: {
    flex: 1
  },

  // social
  socialContainer: {
    ...Styles.Horizontal
  }
});
