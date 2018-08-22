import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { Provider, inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Sizes, Styles } from "localyyz/constants";
import { Forms } from "localyyz/components";

// local
import CartBaseScene from "../components/CartBaseScene";
import Button from "../components/Button";

@inject(stores => ({
  discountCode: stores.cartStore.discountCode,
  applyDiscountCode: stores.cartStore.applyDiscountCode,
  navigateNext: stores.cartUiStore.navigateNext,
  setNextReady: stores.cartUiStore.setNextReady
}))
@observer
export default class Discount extends React.Component {
  static propTypes = {
    applyDiscountCode: PropTypes.func.isRequired,
    navigateNext: PropTypes.func.isRequired,
    discountCode: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { error: null };

    // bindings
    this.onNext = this.onNext.bind(this);
    this.onFocus = this.onFocus.bind(this);

    // data
    this.store = new Forms.Store({
      id: "discount",
      validators: ["isRequired"]
    });
  }

  async onNext() {
    // first, signal loading to disable button while processing
    this.props.setNextReady(false);
    let response = await this.props.applyDiscountCode(this.store.data.discount);

    if (response.error) {
      this.setState({ error: response.error });
    } else {
      await this.props.navigateNext(this.props.navigation);
    }

    // and finally signal ready
    this.props.setNextReady(true);
  }

  onFocus() {
    // clear errors on focus
    this.setState({ error: null });
  }

  render() {
    return (
      <Provider formStore={this.store}>
        <CartBaseScene
          keySeed={this.props.keySeed}
          navigation={this.props.navigation}
          activeSceneId="DiscountScene">
          <CartBaseScene.Content>
            <View style={styles.container}>
              <View style={Styles.Horizontal}>
                <Forms.Field
                  field="discount"
                  label="Coupon code"
                  error={this.state.error}
                  onFocus={this.onFocus}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.field}
                  contentStyle={Styles.Unflex}
                  inputStyle={styles.input}
                  wrapperStyle={styles.fieldWrapper}/>
              </View>
            </View>
            {this.store.isComplete && !this.state.error ? (
              <View style={styles.buttons}>
                <Button onPress={this.onNext}>Add coupon</Button>
              </View>
            ) : null}
          </CartBaseScene.Content>
        </CartBaseScene>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },

  field: {
    flex: 1
  },

  fieldWrapper: {
    paddingHorizontal: undefined,
    paddingVertical: undefined
  },

  input: {
    ...Styles.Text,
    ...Styles.Oversized,
    flex: 1
  },

  buttons: {
    marginHorizontal: Sizes.InnerFrame
  }
});
