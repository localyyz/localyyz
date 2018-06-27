import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Sizes } from "localyyz/constants";
import { BaseScene, Forms } from "localyyz/components";

@inject(stores => ({
  addresses: stores.addressStore.addresses,
  fetch: stores.addressStore.fetch
}))
@observer
export default class Addresses extends React.Component {
  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params || {};

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    let addresses = await this.props.fetch();

    // forward to add address by default if none exist
    if (!addresses || addresses.length < 1) {
      this.addAddress();
    }
  }

  renderItem({ item: address }) {
    return (
      <Forms.BaseField
        label={address.address}
        onPress={() => this.updateAddress(address)}/>
    );
  }

  addAddress() {
    return this.props.navigation.navigate("AddressForm");
  }

  updateAddress(address) {
    return this.props.navigation.navigate("AddressForm", {
      shouldUpdate: true,
      address: address
    });
  }

  render() {
    return (
      <BaseScene backAction={this.props.navigation.goBack} title="Addresses">
        <View style={styles.content}>
          <FlatList
            scrollEnabled={false}
            data={this.props.addresses && this.props.addresses.slice()}
            keyExtractor={address => `${address.id}`}
            renderItem={this.renderItem}/>
          <View style={styles.footer}>
            <Forms.Button isEnabled onPress={() => this.addAddress()}>
              Add a new address
            </Forms.Button>
          </View>
        </View>
      </BaseScene>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },

  footer: {
    alignItems: "center",
    marginVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.OuterFrame
  }
});
