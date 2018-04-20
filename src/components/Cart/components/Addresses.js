import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import PropTypes from "prop-types";

// custom
import Address from "./Address";
import AddressForm from "./AddressForm";
import CartHeader from "./CartHeader";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { inject, observer } from "mobx-react";

@inject(stores => ({
  fetch: () => stores.addressStore.fetch(),
  addresses: stores.addressStore.addresses.slice(),
  remove: addressId => stores.addressStore.remove(addressId),
  getCheckoutSummary: () => stores.cartUiStore.getCheckoutSummary()
}))
@observer
export default class Addresses extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    address: PropTypes.object.isRequired,
    onReady: PropTypes.func,
    title: PropTypes.string,

    // mobx injected
    addresses: PropTypes.array.isRequired,
    fetch: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    getCheckoutSummary: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "Shipping to"
  };

  constructor(props) {
    super(props);
    this.store = this.props.addressStore;
    this.cart = this.props.cartStore;
    this.state = {
      isFormVisible: false
    };

    // bindings
    this.toggleForm = this.toggleForm.bind(this);
    this.onAddressUpdate = this.onAddressUpdate.bind(this);
  }

  componentWillMount() {
    this.props.fetch();
  }

  toggleForm(visible) {
    this.setState({
      isFormVisible: visible != null ? visible : !this.state.isFormVisible
    });
  }

  onAddressUpdate(address) {
    this.props.onReady && this.props.onReady(address);
    if (address) {
      this.props.toggle(false);
      this.toggleForm(false);

      // and move to next incomplete field
      try {
        this.props.getCheckoutSummary();
      } catch (err) {
        // pass on any errors
      }
    }
  }

  get isReady() {
    return this.props.address.address;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.toggle()}>
          <CartHeader
            title={this.props.title}
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
            }>
            {!this.isReady
              ? "no address selected"
              : this.props.address.shortAddress}
          </CartHeader>
        </TouchableOpacity>
        {this.props.isVisible && (
          <View style={styles.addresses}>
            {!this.state.isFormVisible && (
              <View>
                {this.props.addresses.map(address => (
                  <Address
                    key={`address-${address.id}`}
                    address={address}
                    buttonIcon="trash"
                    onActionPress={() => {
                      this.props.remove(address.id).then(
                        // clear previously selected address
                        () => this.onAddressUpdate(false)
                      );
                    }}
                    onPress={() => this.onAddressUpdate(address)}
                  />
                ))}
              </View>
            )}
            {!this.state.isFormVisible && this.props.addresses.length > 0 ? (
              <View style={styles.addAddress}>
                <TouchableOpacity onPress={() => this.toggleForm(true)}>
                  <Text
                    style={[
                      Styles.Text,
                      Styles.Terminal,
                      Styles.Emphasized,
                      Styles.Underlined,
                      styles.addAddressLabel
                    ]}>
                    add a new address
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <AddressForm
                onSubmit={address => this.onAddressUpdate(address)}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  addAddress: {
    padding: Sizes.InnerFrame,
    alignItems: "flex-end"
  }
});
