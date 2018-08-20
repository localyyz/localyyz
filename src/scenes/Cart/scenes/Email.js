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
  email: stores.cartUiStore.cart.email || stores.userStore.email,
  updateEmail: stores.cartUiStore.cart.updateEmail,
  navigateNext: stores.cartUiStore.navigateNext
}))
@observer
export default class Email extends React.Component {
  static propTypes = {
    email: PropTypes.string,
    updateEmail: PropTypes.func.isRequired,
    navigateNext: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // bindings
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);

    // data
    this.store = new Forms.Store({
      id: "email",
      value: this.props.email || null,
      validators: [
        "isRequired",
        email =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            String(email).toLowerCase()
          ) || "Invalid format"
      ]
    });
  }

  onNext() {
    this.props.updateEmail(this.store.data.email);
    this.props.navigateNext(this.props.navigation);
  }

  onBack() {
    return this.props.navigation.goBack(null);
  }

  render() {
    return (
      <Provider formStore={this.store}>
        <CartBaseScene
          keySeed={this.props.keySeed}
          navigation={this.props.navigation}
          activeSceneId="EmailScene"
          backAction={this.onBack}>
          <CartBaseScene.Content>
            <View style={styles.container}>
              <View style={Styles.Horizontal}>
                <Forms.Field
                  field="email"
                  label="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.field}
                  contentStyle={Styles.Unflex}
                  inputStyle={styles.input}
                  wrapperStyle={styles.fieldWrapper}/>
              </View>
            </View>
            {this.store.isComplete ? (
              <View testID="next" style={styles.buttons}>
                <Button onPress={this.onNext}>Next</Button>
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
