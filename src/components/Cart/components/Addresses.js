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

class AddressNew extends React.Component {
  static propTypes = {
    enabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired
  };

  static defaultProps = {
    enabled: false
  };

  render() {
    return this.props.enabled ? (
      <View style={styles.addAddress}>
        <TouchableOpacity onPress={this.props.onPress}>
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
}

export class AddressSelect extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool,
    addresses: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,

    isBilling: PropTypes.bool,
    isShipping: PropTypes.bool,
    selectedAddress: PropTypes.object
  };

  static defaultProps = {
    isEditing: false,
    isBilling: false,
    isShipping: false,
    selectedAddress: {},
    addresses: []
  };

  onRemove = address => {
    Alert.alert("Remove this address?", null, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: () => {
          this.props.onRemove(address);
        }
      }
    ]);
  };

  render() {
    const allowNew = this.props.addresses.length > 0;

    return (
      <View style={styles.addresses}>
        {this.props.isEditing ? (
          <AddressForm
            testID="addressForm"
            isBillng={this.props.isBilling}
            isShipping={this.props.isShipping}
            address={this.props.selectedAddress}
            onCancel={this.props.onCancel}
            onSubmit={this.props.onSelect}/>
        ) : (
          <View>
            {this.props.addresses.map(address => (
              <Address
                key={`address-${address.id}`}
                address={address}
                onEdit={this.props.onEdit}
                onRemove={() => {
                  this.onRemove(address);
                }}
                onPress={() => {
                  this.props.onSelect(address);
                }}/>
            ))}
            <AddressNew
              testID="addressNew"
              enabled={allowNew}
              onPress={this.props.onCreate}/>
          </View>
        )}
      </View>
    );
  }
}

@inject(stores => ({
  addresses: stores.addressStore.addresses,
  fetch: () => stores.addressStore.fetch(),
  remove: address =>
    stores.cartStore.removeAddress({
      address: address
    }),
  update: address =>
    stores.cartStore.updateAddress({
      address: address
    })
}))
@observer
export default class Addresses extends React.Component {
  static propTypes = {
    // always at least an object of '{ isShipping: true/false }'
    address: PropTypes.object.isRequired,
    title: PropTypes.string,

    // mobx injected
    addresses: mobxPropTypes.arrayOrObservableArray.isRequired,
    fetch: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  };

  static defaultProps = {
    title: ""
  };

  constructor(props) {
    super(props);

    // initial states
    this.state = {
      // current address from prop
      currentAddress: props.address,
      // isEditing opens editable address form
      isEditing: props.address.hasError || this.props.addresses.length === 0,
      // isComplete shows completed status
      isComplete:
        props.address && props.address.address && !props.address.hasError,
      // isShipping and isBilling defines type of address this component is
      // editing
      ...this.addressTypes
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.address.hasError) {
      this.setState({
        isEditing: true,
        isComplete: false
      });
    } else {
      this.setState({
        currentAddress: nextProps.address,
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

  get addressTypes() {
    return {
      isShipping:
        this.props.address && this.props.address.isShipping != null
          ? this.props.address.isShipping
          : this.props.isShipping != null ? this.props.isShipping : true,
      isBilling:
        this.props.address && this.props.address.isBilling != null
          ? this.props.address.isBilling
          : this.props.isBilling != null ? this.props.isBilling : true
    };
  }

  onAddressUpdate = address => {
    this.props.update({
      ...address,
      ...this.addressTypes
    });

    this.setState({
      isEditing: false
    });
  };

  render() {
    return (
      <View style={styles.container}>
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

        <AddressSelect
          testID="addressSelect"
          isEditing={this.state.isEditing}
          addresses={this.props.addresses.slice()}
          selectedAddress={this.state.currentAddress}
          onEdit={address => {
            this.setState({
              currentAddress: address,
              lastAddress: address,
              isEditing: true
            });
          }}
          onRemove={this.props.remove}
          onCreate={() => {
            this.setState({
              isEditing: true,
              lastAddress: this.state.currentAddress || {},
              currentAddress: {}
            });
          }}
          onCancel={() => {
            this.setState({
              isEditing: false,
              currentAddress: this.state.lastAddress || {}
            });
          }}
          onSelect={address => this.onAddressUpdate(address)}/>
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
