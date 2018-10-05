import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { SloppyView } from "~/src/components";
import { ApiInstance } from "~/src/global";
import { Product } from "~/src/stores";
import ProductTileV2, { IMAGE_HEIGHT } from "~/src/components/ProductTileV2";
import { Sizes, Styles, Colours } from "~/src/constants";

class Follow extends React.Component {
  constructor(props) {
    super(props);
    this.merchant = props.merchant;
    this.state = {
      isFollowing: props.merchant.isFavourite
    };
  }

  onPress = () => {
    this.setState(
      { isFollowing: !this.state.isFollowing },
      () =>
        this.state.isFollowing
          ? this.merchant.addFavourite()
          : this.merchant.removeFavourite()
    );
  };

  render() {
    const buttonText = this.state.isFollowing ? "Unfollow" : "Follow";
    const followStyle = this.state.isFollowing
      ? { color: Colours.EmphasizedText }
      : {};
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <SloppyView style={{ marginRight: 10 }}>
          <Text style={[styles.follow, followStyle]}>{buttonText}</Text>
        </SloppyView>
      </TouchableWithoutFeedback>
    );
  }
}

export class Merchant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.merchant.id !== prevProps.merchant.id) {
      this.fetchProducts();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.merchant.id !== this.props.merchant.id
      || nextProps.merchant.isFavourite !== this.props.merchant.isFavourite
      || this.state.products.length == 0
      || nextState.products.filter(e => !this.state.products.includes(e))
    );
  }

  fetchProducts = async () => {
    const fetchPath = this.next
      ? this.next.url
      : `places/${this.props.merchant.id}/products?${
          this.props.store.selectedToQuery
        }`;
    ApiInstance.get(fetchPath, {
      limit: 5
    }).then(resolved => {
      if (!resolved.error) {
        this.setState({
          products: resolved.data.map(p => new Product(p))
        });
      }
    });
  };

  onPressPreview = () => {
    const fetchPath = `places/${this.props.merchant.id}/products`;

    this.props.navigation.push("ProductList", {
      fetchPath: fetchPath,
      title: `${this.props.merchant.name}`
    });
  };

  renderProduct = ({ item: product }) => {
    return <ProductTileV2 product={product} />;
  };

  render() {
    return (
      <View
        pointerEvents="box-none"
        style={{ paddingBottom: Sizes.OuterFrame }}>
        <View
          pointerEvents="box-none"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: Sizes.InnerFrame / 2,
            paddingHorizontal: Sizes.InnerFrame
          }}>
          <View
            pointerEvents="box-none"
            style={{
              alignItems: "center",
              flexDirection: "row"
            }}>
            <View style={{ maxWidth: Sizes.Width / 3 }}>
              <Text numberOfLines={1} style={styles.name}>
                {this.props.merchant.name}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: Sizes.InnerFrame / 2
              }}>
              <Text style={styles.separatorDot}>·</Text>
            </View>
            <Follow
              key={`follow-${this.props.merchant.id}`}
              merchant={this.props.merchant}/>
          </View>
          <MaterialIcon.Button
            name="chevron-right"
            style={{ paddingRight: 0 }}
            iconStyle={{ marginRight: 0 }}
            underlayColor={Colours.Transparent}
            backgroundColor={Colours.Transparent}
            onPress={this.onPressPreview}
            size={Sizes.ActionButton}
            color={Colours.EmphasizedText}
            hitSlop={{
              top: Sizes.InnerFrame,
              bottom: Sizes.OuterFrame,
              left: Sizes.OuterFrame,
              right: Sizes.OuterFrame
            }}/>
        </View>
        <FlatList
          data={this.state.products}
          renderItem={this.renderProduct}
          ListEmptyComponent={
            <View style={{ height: IMAGE_HEIGHT + Sizes.InnerFrame }} />
          }
          ItemSeparatorComponent={() => (
            <View style={{ width: Sizes.InnerFrame }} />
          )}
          horizontal
          contentContainerStyle={{ padding: Sizes.InnerFrame }}
          directionalLockEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={p => `p${p.id}`}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    ...Styles.Text,
    ...Styles.Title
  },

  separatorDot: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    fontSize: Sizes.Text
  },

  follow: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    fontSize: Sizes.Text,
    color: Colours.PositiveButton
  }
});

export default withNavigation(Merchant);
