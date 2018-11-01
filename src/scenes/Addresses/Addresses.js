import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight
} from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Colours, Styles, Sizes } from "localyyz/constants";
import { Forms } from "localyyz/components";

@inject(stores => ({
  addresses: stores.addressStore.addresses.slice(),
  fetch: stores.addressStore.fetch
}))
@observer
export default class Addresses extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    ...navigationOptions,
    title: "Saved Addresses",
    headerRight: (
      <MaterialIcon.Button
        color={"black"}
        backgroundColor={Colours.Transparent}
        onPress={() => navigation.navigate("AddressForm", { title: "Add New" })}
        underlayColor={Colours.Transparent}
        style={{
          justifyContent: "flex-end",
          paddingRight: Sizes.InnerFrame,
          alignItems: undefined
        }}
        iconStyle={{
          marginRight: undefined
        }}
        name="add"
        size={32}
        hitSlop={{
          top: Sizes.OuterFrame,
          bottom: Sizes.OuterFrame,
          left: Sizes.OuterFrame,
          right: Sizes.OuterFrame
        }}/>
    )
  });

  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params || {};

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
  }

  componentDidMount() {
    this.props.fetch();
  }

  renderItem({ item: address }) {
    return (
      <TouchableHighlight
        style={{ width: Sizes.Width }}
        onPress={() => this.onPress(address)}
        underlayColor={Colours.Background}>
        <View style={styles.row}>
          <Text style={styles.rowText}>{address.address}</Text>
          <View style={styles.arrow}>
            <MaterialIcon
              name="keyboard-arrow-right"
              size={Sizes.Text}
              color={Colours.SubduedText}/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  onPress(address) {
    !this.onSelect(address) && this.updateAddress(address);
  }

  onSelect(address) {
    if (this.settings.onSelect) {
      this.settings.onSelect(address);

      // and out
      this.props.navigation.goBack(null);

      // help skip updateAddress on onPress
      return true;
    }
  }

  addAddress() {
    return this.props.navigation.navigate("AddressForm", {
      onSubmit: this.onSelect,
      title: "Add New"
    });
  }

  updateAddress(address) {
    return this.props.navigation.navigate("AddressForm", {
      shouldUpdate: true,
      address: address
    });
  }

  addButton = () => {
    return (
      <Forms.Button isEnabled onPress={() => this.addAddress()}>
        Add a new address
      </Forms.Button>
    );
  };

  empty = () => {
    return (
      <View style={styles.footer}>
        <Text style={styles.subtitle}>
          Looks like we don't have an address for you yet.
        </Text>
        {this.addButton()}
      </View>
    );
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: this.props.addresses.length
            ? Sizes.OuterFrame * 2 + Sizes.IOSTabBar
            : 0
        }}
        data={this.props.addresses}
        keyExtractor={address => `${address.id}`}
        renderItem={this.renderItem}
        ListEmptyComponent={this.empty}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              borderBottomWidth: Sizes.Hairline,
              borderBottomColor: Colours.Border
            }}/>
        )}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  row: {
    paddingVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: Sizes.Height / 10
  },

  rowText: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  subtitle: {
    ...Styles.SectionSubtitle,
    textAlign: "center"
  },

  footer: {
    paddingTop: Sizes.OuterFrame,
    paddingHorizontal: Sizes.OuterFrame
  }
});
