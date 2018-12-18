import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";

import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { withNavigation } from "react-navigation";

import ProductTileV2, {
  ProductTileHeight
} from "~/src/components/ProductTileV2";
import { capitalize } from "~/src/helpers";
import { Colours, Styles, Sizes } from "~/src/constants";

export class FeedRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    // optimzation for recyclerview
    return (
      nextProps.style !== this.props.style
      || nextProps.gender !== this.props.gender
      || nextProps.pricing !== this.props.pricing
      || nextProps.type !== this.props.type
      || nextProps.products.filter(e => !this.props.products.includes(e))
    );
  }

  renderProduct = ({ item: product }) => {
    return <ProductTileV2 product={product} />;
  };

  onViewMore = () => {
    let params = {
      fetchPath: this.props.fetchPath,
      title: this.props.title
    };

    params.filtersort = {
      category: this.props.category && this.props.category.id,
      style: this.props.style,
      pricing: this.props.pricing,
      gender: this.props.gender,
      discountMin: 0
    };

    if (this.props.type === "sale") {
      params.filtersort.discountMin = 0.5;
    }

    this.props.navigation.navigate({
      routeName: "ProductList",
      params: params
    });
  };

  render() {
    if (this.props.type == "favourite" && this.props.products.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            margin: Sizes.InnerFrame,
            borderWidth: 1,
            borderStyle: "dashed",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 5
          }}>
          <EntypoIcon
            name={"heart-outlined"}
            size={Sizes.ActionButton * 1.5}
            color={"black"}/>
          <Text
            style={[
              Styles.Text,
              Styles.Emphasized,
              { paddingBottom: Sizes.InnerFrame }
            ]}>
            Add More Favourites
          </Text>
          <Text style={[Styles.Subdued, { textAlign: "center" }]}>
            Recommendations based on your favorite products will appear in your
            feed.
          </Text>
        </View>
      );
    }

    let typeText;
    let title;
    let titleEl;
    switch (this.props.type) {
      case "related":
        typeText = "Because you liked:";
        title = this.props.title;
        titleEl = (
          <Text numberOfLines={2} style={styles.rowTitle}>
            {title}
          </Text>
        );
        break;
      case "recommend":
        typeText = "Recommended based on your style";
        titleEl = (
          <View style={styles.title}>
            <Text style={[styles.rowTitleSub]} numberOfLines={2}>
              Latest{" "}
              <Text style={styles.rowTitle}>
                {`${capitalize(this.props.style)} ${capitalize(
                  this.props.category.label
                )}`}
              </Text>
            </Text>
          </View>
        );
        break;
      case "sale":
        typeText = "Recommended based on your style";
        titleEl = (
          <View style={styles.title}>
            <Text style={styles.rowTitleSub} numberOfLines={2}>
              <Text style={styles.rowTitle}>
                {`${capitalize(this.props.style)} ${capitalize(
                  this.props.category.label
                )}`}
              </Text>{" "}
              On Sale
            </Text>
          </View>
        );
        break;
      default:
        titleEl = <Text style={styles.rowTitle}>{this.props.title}</Text>;
    }

    return (
      <View style={{ paddingVertical: Sizes.OuterFrame }}>
        <View
          style={{
            paddingBottom: Sizes.InnerFrame / 4,
            paddingHorizontal: Sizes.InnerFrame
          }}>
          <Text style={styles.rowTypeText}>{typeText}</Text>
          {titleEl}
        </View>
        <FlatList
          horizontal
          data={this.props.products}
          renderItem={this.renderProduct}
          ListEmptyComponent={
            <View style={{ height: ProductTileHeight + Sizes.InnerFrame }} />
          }
          ItemSeparatorComponent={() => (
            <View style={{ width: Sizes.InnerFrame / 2 }} />
          )}
          onEndReached={this.fetchMore}
          contentContainerStyle={{
            paddingVertical: Sizes.InnerFrame / 2,
            paddingHorizontal: Sizes.InnerFrame
          }}
          directionalLockEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={p => `p${p.id}`}/>
        <TouchableOpacity
          activeOpactity={1}
          onPress={this.onViewMore}
          hitSlop={{
            top: Sizes.OuterFrame,
            bottom: Sizes.OuterFrame,
            left: Sizes.OuterFrame,
            right: Sizes.OuterFrame
          }}
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={styles.action}>
            <Text style={styles.actionText}>View More</Text>
            <MaterialIcon
              name="chevron-right"
              style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
              iconStyle={{ marginRight: 0 }}
              underlayColor={Colours.Transparent}
              backgroundColor={Colours.Transparent}
              size={Sizes.ActionButton}
              color={Colours.Primary}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(FeedRow);

const styles = StyleSheet.create({
  rowTypeText: {
    ...Styles.SubduedText,
    fontFamily: "Helvetica",
    color: Colours.SubduedText
  },

  title: {
    flexDirection: "row",
    maxWidth: Sizes.Width - Sizes.OuterFrame * 2
  },

  rowTitle: {
    fontSize: Sizes.Text,
    fontWeight: "bold",
    maxWidth: Sizes.Width - Sizes.InnerFrame * 2,
    fontFamily: "Helvetica",
    color: Colours.EmphasizedText
  },

  rowTitleSub: {
    fontSize: Sizes.Text,
    marginHorizontal: 0,
    fontFamily: "Helvetica",
    color: Colours.SubduedText
  },

  action: {
    ...Styles.RoundedButton,

    backgroundColor: Colours.Foreground,
    width: Sizes.Width - Sizes.OuterFrame * 4,
    marginHorizontal: Sizes.OuterFrame * 2,
    marginBottom: Sizes.OuterFrame * 2,
    height: Sizes.Width / 8,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: Colours.Primary
  },

  actionText: {
    fontSize: Sizes.SmallText,
    fontWeight: "500",
    fontFamily: "Helvetica",
    color: Colours.Primary
  }
});
