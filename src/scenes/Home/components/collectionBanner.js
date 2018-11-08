import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { withNavigation } from "react-navigation";

import ProgressiveImage from "~/src/components/ProgressiveImage";
import { Styles, Colours, Sizes } from "~/src/constants";

const BannerWidth = Sizes.Width - Sizes.InnerFrame * 2;
const BannerHeight = BannerWidth;

export const CollectionHeight = BannerHeight + Sizes.InnerFrame * 2;

export class CollectionBanner extends React.Component {
  shouldComponentUpdate(nextProps) {
    // optimization for recyclerview
    return (
      (nextProps.id && nextProps.id !== this.props.id)
      || (nextProps.style && nextProps.style !== this.props.style)
      || (nextProps.gender && nextProps.gender !== this.props.gender)
      || (nextProps.pricing && nextProps.pricing !== this.props.pricing)
      || nextProps.type !== this.props.type
      || (nextProps.products
        && nextProps.products.filter(e => !this.props.products.includes(e)))
    );
  }

  onPress = () => {
    let params = {
      title: this.props.name,
      fetchPath: `collections/${this.props.id}/products`,
      collection: this.props
    };
    this.props.navigation.navigate({
      routeName: "ProductList",
      key: `collection${this.props.id}-products`,
      params: params
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <View style={{ paddingBottom: Sizes.InnerFrame }}>
            <Text style={styles.typeText}>Featured Stores</Text>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row"
              }}>
              <Text style={styles.title}>{this.props.name}</Text>;
            </View>
          </View>
          <View style={styles.image}>
            <ProgressiveImage
              source={{
                uri: this.props.imageUrl
              }}
              style={{
                width: BannerWidth,
                height: BannerHeight,
                backgroundColor: Colours.Foreground
              }}/>
            <View style={styles.overlay}>
              <View style={styles.action}>
                <Text style={styles.actionText}>View Store</Text>
                <MaterialIcon
                  name="chevron-right"
                  style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
                  iconStyle={{ marginRight: 0 }}
                  underlayColor={Colours.Transparent}
                  backgroundColor={Colours.Transparent}
                  size={Sizes.Text}
                  color={Colours.EmphasizedText}/>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(CollectionBanner);

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame
  },

  image: {
    justifyContent: "center",
    alignItems: "center"
  },

  typeText: {
    ...Styles.SubduedText,
    fontFamily: "Helvetica",
    color: Colours.SubduedText
  },

  title: {
    fontSize: Sizes.Text,
    fontWeight: "bold",
    fontFamily: "Helvetica"
  },

  overlay: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  },

  action: {
    ...Styles.RoundedButton,

    backgroundColor: Colours.Foreground,
    width: BannerWidth - Sizes.OuterFrame * 4,
    marginHorizontal: Sizes.OuterFrame * 2,
    marginBottom: Sizes.OuterFrame * 2,
    height: BannerHeight / 8,
    borderWidth: Sizes.Hairline,
    borderRadius: 5,
    borderColor: Colours.Border
  },

  actionText: {
    fontSize: Sizes.Text,
    fontWeight: "300",
    fontFamily: "Helvetica"
  }
});
