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

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";

// local
import ExpandableSection from "./ExpandableSection";
import ShippingPolicy from "./ShippingPolicy";

@inject(stores => ({
  place: stores.productStore.product.place,
  returnPolicy: stores.productStore.product.place.returnPolicy
}))
@observer
export class MerchantDetails extends React.Component {
  static propTypes = {
    // mobx injected
    returnPolicy: PropTypes.object.isRequired
  };

  static defaultProps = {
    place: PropTypes.object
  };

  get renderShippingPolicy() {
    return (
      <ExpandableSection
        title="Shipping policy"
        onExpand={() => {
          this.props.navigation.navigate("Modal", {
            type: "shipping policy",
            component: <ShippingPolicy placeId={this.props.place.id} />
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
                  <Text>{this.props.returnPolicy.desc}</Text>
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
      <ExpandableSection title="Return policy" onExpand={returnPolicyFn} />
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
  container: {}
});
