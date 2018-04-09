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
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default class PaymentMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      cvc: null,
      expMonth: null,
      expYear: null,
      name: this.props.defaultName,

      // validity checks
      nameValid: false,
      cvcValid: false,
      expiryValid: false,
      numberValid: false,

      // aggregated check
      ready: false,

      // ui
      isFormVisible: false
    };

    // bindings
    this.onCardUpdate = this.onCardUpdate.bind(this);
    this.onExpiryUpdate = this.onExpiryUpdate.bind(this);
    this.onCvcUpdate = this.onCvcUpdate.bind(this);
    this.onNameUpdate = this.onNameUpdate.bind(this);
    this.onReady = this.onReady.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
    this.isCardValid = this.isCardValid.bind(this);
    this.isCvcValid = this.isCvcValid.bind(this);
    this.isExpiryValid = this.isExpiryValid.bind(this);
    this.focus = this.focus.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onBlue = this.onBlur.bind(this);
  }

  UNSAFE_componentWillReceiveProps(next) {
    // defaultName changes updates state
    next.defaultName !== this.props.defaultName &&
      this.onNameUpdate(next.defaultName);
  }

  isCardValid(card) {
    let splitCard = !!card ? card.split(" ").join("") : "";
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

  onCardUpdate(card) {
    let splitCard = card.split(" ").join("");
    let isValid = this.isCardValid(card);
    this.setState(
      {
        number: _spaces(splitCard) || "",
        numberValid: isValid,
        isCardInvalid: null,
        ready:
          isValid &&
          this.state.nameValid &&
          this.state.cvcValid &&
          this.state.expiryValid
      },
      this.onReady
    );

    // forwarding
    isValid && this.refs.expiry.focus();
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

  onExpiryUpdate(expiry) {
    let splitExpiry = expiry.split("/");
    this.setState(
      {
        expiry: _slash(splitExpiry.join("/")) || "",
        expiryValid: this.isExpiryValid(expiry),
        isExpiryInvalid: null,
        ready:
          this.isExpiryValid(expiry) &&
          this.state.nameValid &&
          this.state.cvcValid &&
          this.state.numberValid
      },
      this.onReady
    );

    // forwarding
    this.isExpiryValid(expiry) && this.refs.cvc.focus();
  }

  isCvcValid(cvc) {
    return !!cvc && cvc.length === 3 && !/[^0-9-\s]+/.test(cvc);
  }

  onCvcUpdate(cvc) {
    this.setState(
      {
        cvc: cvc || "",
        cvcValid: this.isCvcValid(cvc),
        isCvcInvalid: null,
        ready:
          this.isCvcValid(cvc) &&
          this.state.nameValid &&
          this.state.expiryValid &&
          this.state.numberValid
      },
      this.onReady
    );

    // forwarding
    this.isCvcValid(cvc) && this.refs.name.focus();
  }

  isNameValid(name) {
    return (
      !!name &&
      name.length > 0 &&
      name.split(" ").length > 1 &&
      name.split(" ").every(part => part.length > 0)
    );
  }

  onNameUpdate(name) {
    this.setState(
      {
        name: name || "",
        nameValid: this.isNameValid(name),
        isNameInvalid: null,
        ready:
          this.isNameValid(name) &&
          this.state.cvcValid &&
          this.state.expiryValid &&
          this.state.numberValid
      },
      this.onReady
    );
  }

  onBlur(field, isInvalid) {
    this.setState({
      [`is${field}Invalid`]: isInvalid
    });
  }

  onReady() {
    this.props.onReady &&
      this.props.onReady({
        number: this.state.number,
        expiry: this.state.expiry,
        expiryMonth: this.state.expiry && this.state.expiry.split("/")[0],
        expiryYear: this.state.expiry && this.state.expiry.split("/")[1],
        cvc: this.state.cvc,
        name: this.state.name,
        ready: this.state.ready
      });
  }

  focus() {
    this.refs.number.focus();
  }

  toggle(forceOpen) {
    this.setState(
      {
        isFormVisible: forceOpen != null ? forceOpen : !this.state.isFormVisible
      },
      () => {
        if (this.state.isFormVisible) {
          this.props.onOpenPaymentMethods && this.props.onOpenPaymentMethods();

          // auto focus on card number
          this.refs.number.focus();
        } else {
          this.props.onClosePaymentMethods &&
            this.props.onClosePaymentMethods();
        }
      }
    );
  }

  get isReady() {
    return (
      this.props.card &&
      !!this.props.card.ready &&
      !!this.props.card.number &&
      !!this.props.card.expiry &&
      !!this.props.card.cvc &&
      !!this.props.card.name &&
      this.props.card.name.length > 0
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.toggle()}>
          <CartHeader
            title="Payment"
            icon={
              !this.isReady ? (
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
            }
          >
            {this.props.card && this.props.card.ready
              ? `credit ${this.props.card.number}`
              : "no payment method selected"}
          </CartHeader>
        </TouchableOpacity>
        {this.state.isFormVisible && (
          <View style={styles.content}>
            <View style={[Styles.Horizontal, Styles.EqualColumns]}>
              <CartField
                icon="credit-card"
                color={this.state.isCardInvalid && Colours.Fail}
                style={styles.largeSpan}
              >
                <TextInput
                  ref="number"
                  autoCorrect={false}
                  keyboardType="numeric"
                  value={this.state.number}
                  onChangeText={this.onCardUpdate}
                  onEndEditing={() =>
                    this.onBlur("Card", !this.isCardValid(this.state.number))
                  }
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={[
                    Styles.Input,
                    styles.leftInput,
                    styles.input,
                    this.state.isCardInvalid && styles.inputError
                  ]}
                />
              </CartField>
              <CartField
                icon="date-range"
                color={this.state.isExpiryInvalid && Colours.Fail}
              >
                <TextInput
                  ref="expiry"
                  autoCorrect={false}
                  keyboardType="numeric"
                  value={this.state.expiry}
                  onChangeText={this.onExpiryUpdate}
                  onEndEditing={() =>
                    this.onBlur(
                      "Expiry",
                      !this.isExpiryValid(this.state.expiry)
                    )
                  }
                  placeholder="00/00"
                  maxLength={5}
                  style={[
                    Styles.Input,
                    styles.input,
                    this.state.isExpiryInvalid && styles.inputError
                  ]}
                />
              </CartField>
              <CartField
                icon="lock"
                color={this.state.isCvcInvalid && Colours.Fail}
              >
                <TextInput
                  ref="cvc"
                  autoCorrect={false}
                  keyboardType="numeric"
                  value={this.state.cvc}
                  onChangeText={this.onCvcUpdate}
                  onEndEditing={() =>
                    this.onBlur("Cvc", !this.isCvcValid(this.state.cvc))
                  }
                  placeholder="000"
                  maxLength={3}
                  style={[
                    styles.input,
                    Styles.Input,
                    this.state.isCvcInvalid && styles.inputError
                  ]}
                />
              </CartField>
            </View>
            <CartField
              icon="person"
              color={this.state.isNameInvalid && Colours.Fail}
            >
              <TextInput
                ref="name"
                returnKeyType="next"
                autoCorrect={false}
                onSubmitEditing={this.props.onSubmit}
                value={this.state.name}
                onChangeText={this.onNameUpdate}
                onEndEditing={() =>
                  this.onBlur("Name", !this.isNameValid(this.state.name))
                }
                placeholder="Johnny Appleseed"
                style={[
                  Styles.Input,
                  styles.nameInput,
                  styles.leftInput,
                  styles.input,
                  this.state.isNameInvalid && styles.inputError
                ]}
              />
            </CartField>
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
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  nameInput: {
    flex: 1
  },

  leftInput: {
    marginLeft: Sizes.InnerFrame
  },

  content: {
    marginBottom: Sizes.InnerFrame
  },

  largeSpan: {
    flex: 2
  },

  securedContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    marginTop: Sizes.InnerFrame / 2,
    marginHorizontal: Sizes.Width / 6
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
