import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import Address from "./Address";
import AddressForm from "./AddressForm";
import CartHeader from "./CartHeader";
import { UppercasedText } from "localyyz/components";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { inject, observer } from "mobx-react";

@inject("addressStore", "cartStore")
@observer
export default class Addresses extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.addressStore;
    this.cart = this.props.cartStore;
    this.state = {
      isAddressesVisible: false,
      isFormVisible: false,
      address: props.address || this.cart.shippingAddress
    };

    // bindings
    this.toggle = this.toggle.bind(this);
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.onAddressUpdate = this.onAddressUpdate.bind(this);
  }

  componentDidMount() {
    this.store.fetch().then(addresses => {
      // automatically select the first address, or previously selected
      if ((addresses && addresses.length > 0) || this.state.address) {
        // forward up address and close addresses
        this.onAddressUpdate(this.state.address || addresses[0], true);
        this.toggle(false);
      }
    });
  }

  toggle(forceOpen) {
    // either set to some explicit value, or alternate from
    // prev value
    const shouldOpen =
      forceOpen != null ? forceOpen : !this.state.isAddressesVisible;
    this.setState(
      {
        isAddressesVisible: shouldOpen
      },
      () => {
        if (this.state.isAddressesVisible) {
          this.props.onOpenAddresses && this.props.onOpenAddresses();
        } else {
          this.props.onCloseAddresses && this.props.onCloseAddresses();

          // and finally close the form
          this.closeForm();
        }
      }
    );
  }

  openForm() {
    this.setState({ isFormVisible: true });
    this.props.onOpenForm && this.props.onOpenForm();
  }

  closeForm() {
    this.setState({
      isFormVisible: false
    });
    this.props.onCloseForm && this.props.onCloseForm();
  }

  onAddressUpdate(address, skipToggle) {
    this.setState(
      {
        address: address
      },
      () => {
        // update parent callback
        this.props.onReady && this.props.onReady(address, skipToggle);
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.toggle()}>
          <CartHeader
            title="Shipping to"
            icon={
              !this.props.address ? (
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
            {!this.props.address
              ? "no address selected"
              : this.props.address.shortAddress}
          </CartHeader>
        </TouchableOpacity>
        {this.state.isAddressesVisible && (
          <View style={styles.addresses}>
            {!this.state.isFormVisible && (
              <View>
                {this.store.addresses.map(address => (
                  <Address
                    key={`address-${address.id}`}
                    address={address}
                    buttonIcon="trash"
                    onActionPress={() => {
                      this.store.remove(address.id).then(
                        // clear previously selected address
                        () => this.onAddressUpdate(null, true)
                      );
                    }}
                    onPress={() => {
                      this.onAddressUpdate(address);
                      this.toggle(false);
                    }}
                  />
                ))}
              </View>
            )}
            {!this.state.isFormVisible && this.store.addresses.length > 0 ? (
              <View style={styles.addAddress}>
                <TouchableOpacity onPress={this.openForm}>
                  <Text
                    style={[
                      Styles.Text,
                      Styles.Terminal,
                      Styles.Emphasized,
                      Styles.Underlined,
                      styles.addAddressLabel
                    ]}
                  >
                    use a different address
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <AddressForm
                defaultName={this.props.defaultName}
                onSubmit={(address, skipToggle) => {
                  this.onAddressUpdate(address, skipToggle);
                  this.toggle(false);
                }}
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

  addressDetails: {
    marginLeft: Sizes.InnerFrame / 2
  },

  addAddress: {
    padding: Sizes.InnerFrame,
    alignItems: "flex-end"
  }
});
