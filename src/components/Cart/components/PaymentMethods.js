import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import { UppercasedText } from "localyyz/components";
import CartHeader from "./CartHeader";
import CartField from "./CartField";

// third party
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

@inject(stores => ({
  paymentDetails: stores.cartStore.paymentDetails,
  isVisible: stores.cartUiStore.isPaymentVisible,
  toggle: visible => stores.cartUiStore.togglePayment(visible),
  onReady: card => stores.cartStore.usePaymentMethod({ card: card }),
  getCheckoutSummary: () => stores.cartUiStore.getCheckoutSummary()
}))
@observer
export default class PaymentMethods extends React.Component {
  static propTypes = {
    // mobx injected
    toggle: PropTypes.func.isRequired,
    onReady: PropTypes.func.isRequired,
    getCheckoutSummary: PropTypes.func.isRequired,
    paymentDetails: PropTypes.object,
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    isVisible: false,
    paymentDetails: {
      number: null,
      cvc: null,
      expiry: null,
      expiryMonth: null,
      expiryYear: null,
      name: null,

      // validity checks
      nameValid: null,
      cvcValid: null,
      expiryValid: null,
      numberValid: null,

      // aggregated check
      ready: false
    }
  };

  constructor(props) {
    super(props);
    this.state = this.props.paymentDetails;

    // bindings
    this.onCardUpdate = this.onCardUpdate.bind(this);
    this.onExpiryUpdate = this.onExpiryUpdate.bind(this);
    this.onCvcUpdate = this.onCvcUpdate.bind(this);
    this.onNameUpdate = this.onNameUpdate.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
    this.isCardValid = this.isCardValid.bind(this);
    this.isCvcValid = this.isCvcValid.bind(this);
    this.isExpiryValid = this.isExpiryValid.bind(this);
    this.isReady = this.isReady.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onCardUpdate(card) {
    let splitCard = card.split(" ").join("");
    let isValid = this.isCardValid(card);
    this.setState({
      number: _spaces(splitCard) || "",
      numberValid: isValid,
      isCardInvalid: null,
      ready:
        isValid &&
        this.state.nameValid &&
        this.state.cvcValid &&
        this.state.expiryValid
    });

    // forwarding
    isValid && this.refs.expiry.focus();
  }

  onExpiryUpdate(expiry) {
    let splitExpiry = expiry.split("/");
    this.setState({
      expiry: _slash(splitExpiry.join("/")) || "",
      expiryMonth: splitExpiry.length > 0 ? splitExpiry[0] : null,
      expiryYear: splitExpiry.length > 1 ? splitExpiry[1] : null,
      expiryValid: this.isExpiryValid(expiry),
      ready:
        this.isExpiryValid(expiry) &&
        this.state.nameValid &&
        this.state.cvcValid &&
        this.state.numberValid
    });

    // forwarding
    this.isExpiryValid(expiry) && this.refs.cvc.focus();
  }

  onCvcUpdate(cvc) {
    this.setState({
      cvc: cvc || "",
      cvcValid: this.isCvcValid(cvc),
      ready:
        this.isCvcValid(cvc) &&
        this.state.nameValid &&
        this.state.expiryValid &&
        this.state.numberValid
    });

    // forwarding
    this.isCvcValid(cvc) && this.refs.name.focus();
  }

  onNameUpdate(name) {
    this.setState({
      name: name || "",
      nameValid: this.isNameValid(name),
      isNameInvalid: null,
      ready:
        this.isNameValid(name) &&
        this.state.cvcValid &&
        this.state.expiryValid &&
        this.state.numberValid
    });
  }

  onBlur(field, isInvalid) {
    this.setState({
      [`${field}Valid`]: !isInvalid
    });
  }

  onSubmit() {
    this.props.onReady(this.state);
    if (this.isReady(this.state)) {
      this.props.toggle(false);

      // and move to next incomplete field
      try {
        this.props.getCheckoutSummary();
      } catch (err) {
        // pass on any errors
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.toggle()}>
          <CartHeader
            title="Payment"
            icon={
              !this.isReady() ? (
                <EntypoIcon
                  name="dot-single"
                  size={Sizes.IconButton}
                  color={Colours.NegativeButton}
                />
              ) : (
                <FontAwesomeIcon
                  name="check-circle"
                  size={Sizes.IconButton / 2}
                  color={Colours.PositiveButton}
                  style={Styles.IconOffset}
                />
              )
            }>
            {this.isReady()
              ? `credit ${this.props.paymentDetails.number}`
              : "no payment method selected"}
          </CartHeader>
        </TouchableOpacity>
        {this.props.isVisible ? (
          <View>
            <View style={styles.content}>
              <View style={[Styles.Horizontal, Styles.EqualColumns]}>
                <CartField
                  icon="credit-card"
                  label="Credit Card"
                  color={this.state.cardValid === false ? Colours.Fail : null}
                  style={styles.largeSpan}>
                  <TextInput
                    ref="number"
                    autoFocus
                    autoCorrect={false}
                    keyboardType="numeric"
                    value={this.state.number}
                    onChangeText={this.onCardUpdate}
                    onEndEditing={() =>
                      this.onBlur("card", !this.isCardValid(this.state.number))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    style={[
                      Styles.Input,
                      this.state.cardValid === false && styles.inputError
                    ]}
                  />
                </CartField>
                <CartField
                  icon="date-range"
                  label="Expiry"
                  color={
                    this.state.expiryValid === false ? Colours.Fail : null
                  }>
                  <TextInput
                    ref="expiry"
                    autoCorrect={false}
                    keyboardType="numeric"
                    value={this.state.expiry}
                    onChangeText={this.onExpiryUpdate}
                    onEndEditing={() =>
                      this.onBlur(
                        "expiry",
                        !this.isExpiryValid(this.state.expiry)
                      )}
                    placeholder="00/00"
                    maxLength={5}
                    style={[
                      Styles.Input,
                      this.state.expiryValid === false && styles.inputError
                    ]}
                  />
                </CartField>
                <CartField
                  icon="lock"
                  label="CVC"
                  color={this.state.cvcValid === false ? Colours.Fail : null}>
                  <TextInput
                    ref="cvc"
                    autoCorrect={false}
                    keyboardType="numeric"
                    value={this.state.cvc}
                    onChangeText={this.onCvcUpdate}
                    onEndEditing={() =>
                      this.onBlur("cvc", !this.isCvcValid(this.state.cvc))}
                    placeholder="000"
                    maxLength={3}
                    style={[
                      Styles.Input,
                      this.state.cvcValid === false && styles.inputError
                    ]}
                  />
                </CartField>
              </View>
              <CartField
                icon="person"
                label="Cardholder Name"
                color={this.state.nameValid === false ? Colours.Fail : null}>
                <TextInput
                  ref="name"
                  returnKeyType="next"
                  autoCorrect={false}
                  autoCapitalize="words"
                  onSubmitEditing={this.props.onSubmit}
                  value={this.state.name}
                  onChangeText={this.onNameUpdate}
                  onEndEditing={() =>
                    this.onBlur("name", !this.isNameValid(this.state.name))}
                  placeholder="Johnny Appleseed"
                  style={[
                    Styles.Input,
                    this.state.nameValid === false && styles.inputError
                  ]}
                />
              </CartField>
              <View style={styles.useCard}>
                <TouchableOpacity onPress={this.onSubmit}>
                  <View style={Styles.RoundedButton}>
                    <UppercasedText style={styles.useCardLabel}>
                      Use this card
                    </UppercasedText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.securedContainer}>
              <Text style={styles.securedIcon}>⚡️</Text>
              <View style={styles.securedLabelContainer}>
                <Text style={[styles.securedLabel, Styles.Emphasized]}>
                  Payments powered by Stripe
                </Text>
                <Text style={styles.securedLabel}>
                  Your credit card data is handled securely by Stripe and never
                  stored on our servers
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  /*
   * Validation stuff
   */

  isCardValid(card) {
    let splitCard = card ? card.split(" ").join("") : "";
    let cardValid = false;
    if (!/[^0-9-\s]+/.test(splitCard)) {
      let nCheck = 0,
        nDigit = 0,
        bEven = false;
      splitCard = splitCard.replace(/\D/g, "");

      for (var n = splitCard.length - 1; n >= 0; n--) {
        var cDigit = splitCard.charAt(n),
          nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      cardValid = nCheck % 10 == 0 && splitCard.length === 16;
    }

    return cardValid;
  }

  isExpiryValid(expiry) {
    let splitExpiry = expiry && expiry.split("/");
    return (
      !!expiry &&
      (parseInt(splitExpiry[0]) > 0 &&
        parseInt(splitExpiry[0]) < 13 &&
        // 2017
        parseInt(splitExpiry[1]) > 17)
    );
  }

  isCvcValid(cvc) {
    return !!cvc && cvc.length === 3 && !/[^0-9-\s]+/.test(cvc);
  }

  isNameValid(name) {
    return (
      !!name &&
      name.length > 0 &&
      name.split(" ").length > 1 &&
      name.split(" ").every(part => part.length > 0)
    );
  }

  isReady(card) {
    card = card || this.props.paymentDetails || this.state;
    return (
      this.isCardValid(card.number) &&
      this.isNameValid(card.name) &&
      this.isCvcValid(card.cvc) &&
      this.isExpiryValid(card.expiry)
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  largeSpan: {
    flex: 2
  },

  securedContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.Width / 8
  },

  securedLabelContainer: {
    flex: 1
  },

  securedLabel: {
    ...Styles.TinyText,
    ...Styles.Subdued,
    flex: 1,
    flexWrap: "wrap",
    marginVertical: Sizes.InnerFrame / 10
  },

  securedIcon: {
    ...Styles.SmallText,
    marginRight: Sizes.InnerFrame
  },

  inputError: {
    color: Colours.Fail
  },

  useCard: {
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame,
    alignItems: "flex-start"
  },

  useCardLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});

function _spaces(card) {
  card = card.split(" ").join("");
  if (card.length > 0) {
    return card.match(new RegExp(".{1,4}", "g")).join(" ");
  }
}

function _slash(expiry) {
  expiry = expiry.split("/").join("");
  if (expiry.length > 0) {
    return expiry.match(new RegExp(".{1,2}", "g")).join("/");
  }
}
