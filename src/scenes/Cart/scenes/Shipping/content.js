import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// local
import CartBaseScene from "../../components/CartBaseScene";
import Button from "../../components/Button";

@inject(stores => ({
  navigateNext: stores.cartUiStore.navigateNext,
  addresses: stores.addressStore.addresses,
  fetch: stores.addressStore.fetch,
  updateShipping: stores.cartStore.updateShipping,
  updateBilling: stores.cartStore.updateBilling,
  selectedAddress: stores.cartStore.shippingAddress,
  isShippingAddressComplete: stores.cartStore.isShippingAddressComplete
}))
@observer
export default class ShippingContent extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.fetch = this.fetch.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    await this.props.fetch();

    // TODO: select the first one or prompt new address if nothing selected
    if (
      !this.props.isShippingAddressComplete
      || this.props.addresses.length <= 0
    ) {
      if (this.props.addresses.length > 0) {
        this.onSelect(this.props.addresses[0]);
      } else {
        this.addAddress();
      }
    }
  }

  addAddress() {
    return this.props.navigation.navigate("AddressForm", {
      onSubmit: this.onSelect
    });
  }

  onNext() {
    this.props.navigateNext(this.props.navigation);
  }

  onSelect(address) {
    this.props.updateShipping(address);
    this.props.updateBilling(address);
  }

  get data() {
    return [...this.props.addresses.slice(), { component: this.footer }];
  }

  get footer() {
    return (
      <TouchableOpacity onPress={this.addAddress}>
        <View style={styles.footer}>
          <Text style={styles.addLabel}>.. or enter a new address</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderItem({ item: address }) {
    return (
      address.component || (
        <TouchableOpacity onPress={() => this.onSelect(address)}>
          <View style={styles.itemContainer}>
            <View style={styles.address}>
              <Text numberOfLines={1} style={styles.title}>
                {address.address}
              </Text>
            </View>
            {this.props.selectedAddress
            && this.props.selectedAddress.id === address.id ? (
              <MaterialIcon
                name="check-circle"
                size={Sizes.H1}
                color={Colours.Text}/>
            ) : null}
          </View>
        </TouchableOpacity>
      )
    );
  }

  render() {
    return (
      <CartBaseScene.Content>
        <View style={styles.container}>
          <FlatList
            data={this.data}
            renderItem={this.renderItem}
            keyExtractor={(e, i) => `address-${e.id}-${i}`}/>
        </View>
        {this.props.isShippingAddressComplete ? (
          <View testID="next" style={styles.buttons}>
            <Button onPress={this.onNext}>Next</Button>
          </View>
        ) : null}
      </CartBaseScene.Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },

  itemContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame
  },

  address: {
    flex: 1,
    paddingRight: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Oversized
  },

  addLabel: {
    ...Styles.Text
  },

  buttons: {
    marginHorizontal: Sizes.InnerFrame
  }
});
