import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

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
    let title;
    switch (this.props.type) {
      case "recommend":
        title = `Latest ${capitalize(this.props.style)} ${capitalize(
          this.props.category.label
        )}`;
        break;
      case "sale":
        title = `${capitalize(this.props.style)} ${capitalize(
          this.props.category.label
        )} On Sale`;
        break;
      default:
        title = this.props.title;
    }

    let params = {
      fetchPath: this.props.fetchPath,
      title: title
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
            Favorite More Products
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
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.rowTitleSub, { paddingRight: 5 }]}>
              Latest
            </Text>
            <Text style={styles.rowTitle}>{capitalize(this.props.style)}</Text>
            <Text style={[styles.rowTitle, { paddingLeft: 5 }]}>
              {capitalize(this.props.category.label)}
            </Text>
          </View>
        );
        break;
      case "sale":
        typeText = "Recommended based on your style";
        titleEl = (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.rowTitle}>{capitalize(this.props.style)}</Text>
            <Text style={[styles.rowTitle, { paddingLeft: 5 }]}>
              {capitalize(this.props.category.label)}
            </Text>
            <Text style={styles.rowTitleSub}> On Sale</Text>
          </View>
        );
        break;
      default:
        titleEl = <Text style={styles.rowTitle}>{this.props.title}</Text>;
    }

    return (
      <View style={{ paddingBottom: Sizes.OuterFrame }}>
        <View
          style={{
            paddingBottom: Sizes.InnerFrame / 4,
            paddingHorizontal: Sizes.InnerFrame
          }}>
          <Text style={styles.rowTypeText}>{typeText}</Text>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row"
            }}>
            {titleEl}
            <MaterialIcon.Button
              name="chevron-right"
              style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
              iconStyle={{ marginRight: 0 }}
              underlayColor={Colours.Transparent}
              backgroundColor={Colours.Transparent}
              onPress={this.onViewMore}
              size={Sizes.ActionButton}
              color={Colours.EmphasizedText}
              hitSlop={{
                top: Sizes.OuterFrame,
                bottom: Sizes.OuterFrame,
                left: Sizes.OuterFrame,
                right: Sizes.OuterFrame
              }}/>
          </View>
        </View>
        <FlatList
          horizontal
          data={this.props.products}
          renderItem={this.renderProduct}
          ListEmptyComponent={
            <View style={{ height: ProductTileHeight + Sizes.InnerFrame }} />
          }
          ItemSeparatorComponent={() => (
            <View style={{ width: Sizes.InnerFrame / 3 }} />
          )}
          onEndReached={this.fetchMore}
          contentContainerStyle={{ padding: Sizes.InnerFrame }}
          directionalLockEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={p => `p${p.id}`}/>
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

  rowTitle: {
    fontSize: Sizes.Text,
    fontWeight: "bold",
    maxWidth: 3 * Sizes.Width / 4,
    fontFamily: "Helvetica"
  },

  rowTitleSub: {
    fontSize: Sizes.Text,
    marginHorizontal: 0,
    fontFamily: "Helvetica",
    color: Colours.SubduedText
  }
});
