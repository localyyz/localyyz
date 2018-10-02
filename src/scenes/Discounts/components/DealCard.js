import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard,
  Image
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Timer } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";
import Moment from "moment";

// custom
import { inject } from "mobx-react/native";
import { GA } from "localyyz/global";

const SlideHeight = 2 * Sizes.Height / 5;
const SlideWidth = 3 * Sizes.Width / 4;
const itemHorizontalMargin = Sizes.Width / 50;

export const sliderWidth = Sizes.Width;
export const CardHeight = SlideHeight;
export const itemWidth = SlideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

@inject(stores => ({
  store: stores.dealStore,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  deals: stores.dealStore.deals ? stores.dealStore.deals.slice() : [],
  dealType: stores.dealStore.dealType && stores.dealStore.dealType.id
}))
export class DealCard extends React.Component {
  copyCodeButton = async () => {
    await Clipboard.setString(this.props.code);
    alert("Discount Code Copied to Clipboard!");
  };

  buildParams = () => {
    const { title, id, productType, merchantId } = this.props;
    if (productType === 3) {
      this.path = `places/${merchantId}/products`;
    } else {
      this.path = `deals/${id}/products`;
    }
    return {
      fetchPath: this.path,
      title: title,
      dealTab: this.props.dealTab,
      dealType: this.props.dealType
    };
  };

  image = () => {
    const { imageUrl } = this.props;
    return <Image source={{ uri: imageUrl }} style={styles.image} />;
  };

  viewProductsButton = () => {
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams()
    });
  };

  render() {
    const topCornerStyle = this.props.imageUrl
      ? {}
      : {
          borderTopLeftRadius: entryBorderRadius,
          borderTopRightRadius: entryBorderRadius
        };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.props.onPress}
        style={[styles.card, this.props.cardStyle]}>
        {this.props.imageUrl !== "" ? (
          <View style={styles.imageContainer}>
            {this.image()}
            <View style={styles.radiusMask} />
          </View>
        ) : null}
        <View style={[styles.textContainer, topCornerStyle]}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.description}</Text>
            <View>
              {this.props.timed == true && this.props.status == "3" ? (
                <View>
                  <Text style={styles.timer}>Ends in:</Text>
                  <Text style={styles.timer}>
                    <Timer
                      target={Moment(this.props.endAt).toArray()}
                      onComplete={() =>
                        this.props.navigation && this.props.navigation.goBack()
                      }/>
                  </Text>
                </View>
              ) : this.props.status == "1" ? (
                <View>
                  <Text style={styles.timer}>Starting in:</Text>
                  <Text style={styles.timer}>
                    <Timer
                      target={Moment(this.props.startAt).toArray()}
                      onComplete={() =>
                        this.props.navigation && this.props.navigation.goBack()
                      }/>
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View>
            <Text style={styles.merchant}>
              {this.props.merchant.toUpperCase()}
            </Text>
          </View>
          <View>
            {this.props.info !== "" ? (
              <View>
                <Text style={styles.info}>{this.props.info}</Text>
              </View>
            ) : (
              <View>
                <Text numberOfLines={3} />
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity onPress={this.viewProductsButton}>
                <Text style={styles.buttonText}>{"View Products"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity onPress={this.copyCodeButton}>
                <Text style={styles.buttonText}>{"Copy Code"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.shadow} />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(DealCard);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: itemHorizontalMargin,
    paddingVertical: 10,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    borderRadius: entryBorderRadius
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colours.Background,
    borderBottomWidth: 3,
    alignItems: "center",
    minHeight: 42
  },

  textContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    paddingHorizontal: 16,
    paddingTop: 2
  },

  imageContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },

  image: {
    resizeMode: "cover",
    height: SlideHeight / 2,
    borderRadius: entryBorderRadius,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },

  radiusMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: "white"
  },

  buttonContainer: {
    flexDirection: "row",
    backgroundColor: Colours.Transparent,
    justifyContent: "space-between"
  },

  title: {
    flexDirection: "column",
    textAlign: "left",
    //marginLeft: 5,
    color: Colours.black,
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5
  },

  timer: {
    fontWeight: Sizes.Medium,
    fontSize: 17,
    color: Colours.DarkBlue,
    alignItems: "center",
    textAlign: "center"
  },

  button: {
    ...Styles.RoundedSubButton
  },

  buttonText: {
    fontSize: Sizes.SmallText,
    fontWeight: "300",
    paddingTop: 2,
    paddingBottom: 2
  },

  merchant: {
    ...Styles.Text,
    textAlign: "left",
    paddingTop: 8
  },

  info: {
    fontSize: 13,
    color: Colours.SubduedText,
    textAlign: "left"
  }
});
