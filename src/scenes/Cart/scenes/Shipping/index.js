import React from "react";

// local
import CartBaseScene from "../../components/CartBaseScene";
import ShippingContent from "./content";

export default class Shipping extends React.Component {
  render() {
    return (
      <CartBaseScene
        keySeed={this.props.keySeed}
        navigation={this.props.navigation}
        activeSceneId="ShippingScene">
        <ShippingContent navigation={this.props.navigation} />
      </CartBaseScene>
    );
  }
}
