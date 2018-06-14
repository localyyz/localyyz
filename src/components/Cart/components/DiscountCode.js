import React from "react";
import { inject, observer } from "mobx-react/native";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";
import {
  Colours,
  Sizes,
  Styles,
  DEFAULT_DISCOUNT_CODE
} from "localyyz/constants";
import { UppercasedText } from "localyyz/components";
import CartHeader from "./CartHeader";
import CartField from "./CartField";

@inject(stores => ({
  applyDiscountCode: stores.cartStore.applyDiscountCode
}))
@observer
export default class DiscountCode extends React.Component {
  static propTypes = {
    applyDiscountCode: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isVerified: false,
      isOpen: false,
      discountCode: "",
      newDiscountCode: ""
    };

    this.updateDiscountCode = this.updateDiscountCode.bind(this);
    this.verifyDiscountCode = this.verifyDiscountCode.bind(this);
    this.toggleDiscountForm = this.toggleDiscountForm.bind(this);
  }

  toggleDiscountForm = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  updateDiscountCode = discountCode => {
    this.setState({ newDiscountCode: discountCode });
  };

  verifyDiscountCode = () => {
    console.log(this.state.newDiscountCode);
    if (
      this.state.newDiscountCode.length > 0
      && this.props.applyDiscountCode({
        discountCode: this.state.newDiscountCode
      })
    ) {
      this.setState({
        isVerified: true,
        isOpen: false,
        discountCode: this.state.newDiscountCode
      });
    } else {
      this.setState({
        isVerified: false,
        isOpen: true,
        discountCode: ""
      });
    }
  };

  get renderDiscountForm() {
    return (
      <View style={style.formContainer}>
        <Animatable.View
          animation="fadeInDown"
          duration={200}
          style={[Styles.Horizontal, Styles.EqualColumns]}>
          <CartField
            icon="attach-money"
            label="Discount Code"
            color={Colours.EmphasizedText}>
            <TextInput
              ref="discount_code"
              autoCorrect={true}
              autoCapitalize="characters"
              placeholder={DEFAULT_DISCOUNT_CODE}
              placeholderTextColor={Colours.SubduedText}
              style={Styles.Input}
              value={this.state.discountCode}
              onChangeText={discount => this.updateDiscountCode(discount)}
              onEndEditing={this.verifyDiscountCode}/>
          </CartField>
        </Animatable.View>
        <TouchableOpacity
          style={style.addDiscount}
          onPress={this.verifyDiscountCode}>
          <View style={Styles.RoundedButton}>
            <UppercasedText style={style.addButtonLabel}>
              apply code
            </UppercasedText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.toggleDiscountForm()}>
          <CartHeader
            ref="verifyDiscountIcon"
            title="Discount code"
            icon={
              this.state.isVerified ? (
                <FontAwesomeIcon
                  name="check-circle"
                  size={Sizes.IconButton / 2}
                  color={Colours.PositiveButton}
                  style={Styles.IconOffset}/>
              ) : (
                <EntypoIcon
                  name="dot-single"
                  size={Sizes.IconButton}
                  color={Colours.NegativeButton}/>
              )
            }>
            {this.state.isVerified
              ? this.state.discountCode
              : "no discount code applied"}
          </CartHeader>
        </TouchableOpacity>
        {this.state.isOpen ? this.renderDiscountForm : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  formContainer: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },
  addDiscount: {
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame,
    alignItems: "flex-start"
  },
  addButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
