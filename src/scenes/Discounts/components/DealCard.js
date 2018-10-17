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

// full card width (non carousel items)
export const CardWidth = Sizes.Width - Sizes.InnerFrame;
export const CardHeight = 2 * Sizes.Height / 5;

// carousel card width
const itemHorizontalMargin = Sizes.Width / 50;
const slideWidth = 3 * Sizes.Width / 4;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const MaxTimerApply = 24; // 24 hours

@inject(stores => ({
  store: stores.dealStore,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  deals: stores.dealStore.deals ? stores.dealStore.deals.slice() : [],
  dealType: stores.dealStore.dealType && stores.dealStore.dealType.id
}))
export class DealCard extends React.Component {
  copyCodeButton = async () => {
    await Clipboard.setString(this.props.code);
    GA.trackEvent(
      "deals",
      "copy code",
      `${this.props.merchant}-${this.props.code}`,
      0
    );
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

    var now = Moment();
    var endsAtDiff = Moment.duration(
      Moment(this.props.endAt).diff(now)
    ).asHours();
    var startsAtDiff = Moment.duration(Moment(this.props.startAt).diff(now));

    return (
      <View style={[styles.card, this.props.cardStyle]}>
        {this.props.imageUrl !== "" ? (
          <View style={styles.imageContainer}>
            {this.image()}
            <View style={styles.radiusMask} />
          </View>
        ) : null}
        <View style={[styles.textContainer, topCornerStyle]}>
          <View style={styles.titleContainer}>
            <View style={{ width: 2 * (itemWidth - Sizes.OuterFrame) / 3 }}>
              <Text numberOfLines={2} style={styles.title}>
                {this.props.description}
              </Text>
            </View>
            {this.props.timed == true && this.props.status == "3" ? (
              <View style={{ maxWidth: (itemWidth - Sizes.OuterFrame) / 3 }}>
                <Text style={styles.timer}>Ends in:</Text>
                {endsAtDiff > MaxTimerApply ? (
                  <Text style={styles.timer}>
                    {Moment(this.props.endAt).fromNow(true)}
                  </Text>
                ) : (
                  <Timer
                    style={styles.timer}
                    target={Moment(this.props.endAt).toArray()}/>
                )}
              </View>
            ) : this.props.status == "1" ? (
              <View style={{ maxWidth: (itemWidth - Sizes.OuterFrame) / 3 }}>
                <Text style={styles.timer}>Starting in:</Text>
                {startsAtDiff > MaxTimerApply ? (
                  <Text style={styles.timer}>
                    {Moment(this.props.startAt).fromNow(true)}
                  </Text>
                ) : (
                  <Timer
                    style={styles.timer}
                    target={Moment(this.props.startAt).toArray()}/>
                )}
              </View>
            ) : null}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.merchant}>
              {this.props.merchant.toUpperCase()}
            </Text>
            {this.props.info !== "" ? (
              <Text style={styles.info}>{this.props.info}</Text>
            ) : (
              <Text numberOfLines={3} />
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
      </View>
    );
  }
}

export default withNavigation(DealCard);

const styles = StyleSheet.create({
  card: {
    paddingBottom: 10,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    backgroundColor: Colours.Foreground,
    borderRadius: entryBorderRadius
  },

  textContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    paddingTop: 2
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.InnerFrame,
    borderBottomColor: Colours.Background,
    borderBottomWidth: 3,
    alignItems: "center",
    minHeight: 42
  },

  imageContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },

  image: {
    resizeMode: "cover",
    height: CardHeight / 2,
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
    width: itemWidth / 3,
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

  infoContainer: {
    paddingHorizontal: Sizes.InnerFrame
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
