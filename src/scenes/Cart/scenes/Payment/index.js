import React from "react";

// local
import CartBaseScene from "../../components/CartBaseScene";
import PaymentContent from "./content";

export default class Payment extends React.Component {
  render() {
    return (
      <CartBaseScene
        keySeed={this.props.keySeed}
        navigation={this.props.navigation}
        activeSceneId="PaymentScene">
        <PaymentContent navigation={this.props.navigation} />
      </CartBaseScene>
    );
  }
}
