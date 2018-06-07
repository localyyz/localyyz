import React from "react";
import { Alert, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import PropTypes from "prop-types";

// custom
import Address from "./Address";
import AddressForm from "./AddressForm";
import CartHeader from "./CartHeader";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  inject,
  observer,
  PropTypes as mobxPropTypes
} from "mobx-react/native";

@inject((props, stores) => ({
  addresses: (props.addressStore || stores.addressStore).addresses,
  fetch: () => (props.addressStore || stores.addressStore ).fetch(),
  remove: address => (props.cartStore || stores.cartStore).removeAddress({
      address: address
    }),
  update: address => (props.cartStore || stores.cartStore).updateAddress({
      address: address
    })
}))
@observer
export default class Addresses extends React.Component {
  static propTypes = {
    address: PropTypes.object.isRequired,
    title: PropTypes.string,

    // mobx injected
    addresses: mobxPropTypes.arrayOrObservableArray.isRequired,
    fetch: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: "",
    address: {}
  };

  constructor(props) {
    super(props);

    // initial states
    this.state = {
      // current address from prop
      currentAddress: props.address,
      // isSelecting opens address(es) selection list
      isSelecting: props.address.address,
      // isEditing opens editable address form
      isEditing: props.address.hasError || this.props.addresses.length === 0,
      // isComplete shows completed status
      isComplete:
        props.address && props.address.address && !props.address.hasError,
      // isShipping and isBilling defines type of address this component is
      // editing
      isShipping: props.address.isShipping,
      isBilling: props.address.isBilling
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.address.hasError) {
      this.setState({
        isSelecting: true,
        isEditing: true,
        isComplete: false
      });
    } else {
      this.setState({
        currentAddress: nextProps.address,
        // isSelecting opens address(es) selection list
        isSelecting: nextProps.address.address,
        // isEditing opens editable address form
        isEditing:
          nextProps.address.hasError || nextProps.addresses.length === 0,
        // isComplete shows completed status
        isComplete: !!nextProps.address.address
      });
    }
  }

  componentDidMount() {
    this.props.fetch();
  }

  toggleSelect = selecting => {
    // determine if selecting
    const isSelecting = selecting != null ? selecting : !this.state.isSelecting;

    this.setState({
      isSelecting: isSelecting,
      // empty addresses automatically toggle isEditing
      isEditing: isSelecting && this.props.addresses.length === 0
    });
  };

  onAddressUpdate = address => {
    this.props.update({
      ...address,
      isShipping: this.state.isShipping,
      isBilling: this.state.isBilling
    });

    this.setState({
      isEditing: false
    });
  };

  onAddressRemove = address => {
    Alert.alert("Remove this address?", null, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: () => {
          this.props.remove(address);
        }
      }
    ]);
  };

  get renderEditAddress() {
    return this.state.currentAddress.id ? (
      <View style={styles.addAddress}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isEditing: true });
          }}>
          <Text
            style={[
              Styles.Text,
              Styles.Terminal,
              Styles.Emphasized,
              Styles.Underlined,
              styles.addAddressLabel
            ]}>
            edit current address
          </Text>
        </TouchableOpacity>
      </View>
    ) : null;
  }

  get renderCreateAddress() {
    return this.props.addresses.length > 0 ? (
      <View style={styles.addAddress}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isEditing: true });
          }}>
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
    ) : null;
  }

  get renderAddressForm() {
    return (
      <AddressForm
        address={this.state.currentAddress}
        onSubmit={address => this.onAddressUpdate(address)}/>
    );
  }

  get renderAddresses() {
    return (
      <View style={styles.addresses}>
        {!this.state.isEditing ? (
          <View>
            {this.props.addresses.slice().map(address => (
              <Address
                key={`address-${address.id}`}
                address={address}
                buttonIcon="trash"
                onActionPress={this.onAddressRemove}
                onPress={() => {
                  this.setState({
                    currentAddress: address,
                    isEditing: true
                  });
                }}/>
            ))}
            {this.renderCreateAddress}
          </View>
        ) : (
          this.renderAddressForm
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.toggleSelect()}>
          <CartHeader
            ref="header"
            title={this.props.title}
            icon={
              this.state.isComplete ? (
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
            {this.state.isComplete
              ? this.state.currentAddress.shortAddress
              : "no address selected"}
          </CartHeader>
        </TouchableOpacity>
        {this.state.isSelecting ? this.renderAddresses : null}
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
