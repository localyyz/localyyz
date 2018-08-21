import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { Provider, inject, observer } from "mobx-react/native";
import Moment from "moment";

// custom
import { Sizes, Styles } from "localyyz/constants";
import { Forms } from "localyyz/components";
import { PaymentCard } from "localyyz/models";

// local
import CartBaseScene from "../../components/CartBaseScene";
import Button from "../../components/Button";

// constants
const DEBUG = false;
const DEBUG_CARD = "4242 4242 4242 4242";
const DEBUG_EXPIRY = "11/23";
const DEBUG_CVC = "444";

@inject(stores => ({
  card: stores.cartStore.paymentDetails,
  updateCard: stores.cartStore.updatePayment,
  updateBilling: stores.cartStore.updateBilling,
  billingAddress: stores.cartStore.billingAddress,
  shippingAddress: stores.cartStore.shippingAddress,
  navigateNext: stores.cartUiStore.navigateNext,
  name:
    stores.cartStore.shippingAddress
    && stores.cartStore.shippingAddress.isComplete
      ? `${stores.cartStore.shippingAddress.firstName} ${
          stores.cartStore.shippingAddress.lastName
        }`
      : ""
}))
@observer
export default class PaymentContent extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onNext = this.onNext.bind(this);
    this.changeBilling = this.changeBilling.bind(this);

    // form schema, validation, masks, and auto focusing
    this.store = new Forms.Store(
      {
        id: "number",
        value: DEBUG
          ? DEBUG_CARD
          : this.props.card && this.props.card.isComplete
            ? this.props.card.number
            : null,
        validators: ["isRequired", this.validateNumberValid],
        mask: this.maskCardSpaces
      },
      {
        id: "expiry",
        value: DEBUG
          ? DEBUG_EXPIRY
          : this.props.card && this.props.card.isComplete
            ? `${this.props.card.expiryMonth}/${this.props.card.expiryYear}`
            : null,
        validators: [
          "isRequired",
          this.validateExpiryWellFormatted,
          this.validateExpiryCurrent
        ],
        mask: this.maskExpirySlashes
      },
      {
        id: "cvc",
        value: DEBUG
          ? DEBUG_CVC
          : this.props.card && this.props.card.isComplete
            ? this.props.card.cvc
            : null,
        validators: ["isRequired", this.validateCvcValid]
      }
    );
  }

  changeBilling() {
    return this.props.navigation.navigate("Addresses", {
      onSelect: this.props.updateBilling
    });
  }

  onNext() {
    this.props.updateCard(
      new PaymentCard({
        ...this.store.data,
        expiryMonth: this.store.data.expiry.split("/")[0],
        expiryYear: this.store.data.expiry.split("/")[1],
        name: this.props.name
      })
    );
    this.props.navigateNext(this.props.navigation);
  }

  get billingAddress() {
    return this.props.billingAddress
      ? this.props.billingAddress.id === this.props.shippingAddress.id
        ? "Same as shipping address"
        : this.props.billingAddress.address
      : "Select an address";
  }

  render() {
    return (
      <Provider formStore={this.store}>
        <CartBaseScene.Content>
          <View style={styles.container}>
            <View style={styles.row}>
              <Forms.Field
                field="number"
                label="Card number"
                keyboardType="numeric"
                style={styles.field}
                contentStyle={Styles.Unflex}
                inputStyle={styles.input}
                wrapperStyle={styles.fieldWrapper}/>
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <Forms.Field
                field="expiry"
                label="Expiry"
                keyboardType="numeric"
                style={styles.field}
                contentStyle={Styles.Unflex}
                inputStyle={styles.input}
                wrapperStyle={styles.fieldWrapper}/>
              <Forms.Field
                field="cvc"
                label="CVV (Back 3 digits)"
                keyboardType="numeric"
                style={styles.field}
                contentStyle={Styles.Unflex}
                inputStyle={styles.input}
                wrapperStyle={styles.fieldWrapper}/>
            </View>
            <View style={styles.spacer} />
            <View style={styles.row}>
              <Forms.BaseField
                label="Billing address"
                style={styles.field}
                contentStyle={Styles.Unflex}
                wrapperStyle={styles.fieldWrapper}
                onPress={this.changeBilling}>
                <Text numberOfLines={1} style={styles.billing}>
                  {this.billingAddress}
                </Text>
              </Forms.BaseField>
            </View>
          </View>
          {this.store.isComplete ? (
            <View testID="next" style={styles.buttons}>
              <Button onPress={this.onNext}>Next</Button>
            </View>
          ) : null}
        </CartBaseScene.Content>
      </Provider>
    );
  }

  // validators
  validateNumberValid = number => {
    let numbers = number ? number.split(" ").join("") : "";
    let cardValid = false;
    if (!/[^0-9-\s]+/.test(numbers)) {
      let nCheck = 0,
        nDigit = 0,
        bEven = false;
      numbers = numbers.replace(/\D/g, "");

      for (var n = numbers.length - 1; n >= 0; n--) {
        var cDigit = numbers.charAt(n);
        var nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      cardValid = nCheck % 10 == 0 && numbers.length === 16;
    }

    return cardValid || "Invalid number";
  };

  validateExpiryWellFormatted = expiry => {
    let [month]
      = (expiry && expiry.split("/").map(part => parseInt(part))) || [];
    return (month <= 12 && expiry.length === 5) || "Format is MM/YY";
  };

  validateExpiryCurrent = expiry => {
    let [month, year]
      = (expiry && expiry.split("/").map(part => parseInt(part))) || [];
    let [currentMonth, currentYear] = Moment()
      .format("MM/YY")
      .split("/")
      .map(part => parseInt(part));

    return (
      (month
        && year
        && (year > currentYear
          || (year === currentYear && month >= currentMonth)))
      || "Card is expired"
    );
  };

  validateCvcValid = cvc =>
    (!!cvc && cvc.length === 3 && !/[^0-9-\s]+/.test(cvc)) || "Invalid CVV";

  maskCardSpaces = card => {
    let formattedCard = card.split(" ").join("");
    return formattedCard.length > 0
      ? formattedCard.match(new RegExp(".{1,4}", "g")).join(" ")
      : "";
  };

  maskExpirySlashes = expiry => {
    let formattedExpiry = expiry.split("/").join("");
    return formattedExpiry.length > 0
      ? formattedExpiry.match(new RegExp(".{1,2}", "g")).join("/")
      : "";
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },

  row: {
    ...Styles.Horizontal
  },

  spacer: {
    height: Sizes.OuterFrame
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

  billing: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  },

  buttons: {
    marginHorizontal: Sizes.InnerFrame
  }
});
