import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Clipboard
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Timer } from "localyyz/components";

// third party
import { inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import Moment from "moment";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

// custom
import { GA } from "~/src/global";
import ProgressiveImage from "~/src/components/ProgressiveImage";

// full card width (non carousel items)
export const CardWidth = Sizes.Width - Sizes.InnerFrame;
export const CardHeight = Sizes.Height / 3;

const MaxTimerApply = 24; // 24 hours

@inject(stores => ({
  store: stores.dealStore,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  dealType: stores.dealStore.dealType && stores.dealStore.dealType.id
}))
export class DealCard extends React.Component {
  copyCodeButton = async () => {
    await Clipboard.setString(this.props.code);
    GA.trackEvent(
      "deals",
      "copy code",
      `${this.props.place.name}-${this.props.code}`,
      0
    );
    alert("Discount Code Copied to Clipboard!");
  };

  buildParams = () => {
    const { id, productType, place } = this.props;
    if (productType === 3) {
      this.path = `places/${place.id}/products`;
    } else {
      this.path = `deals/${id}/products`;
    }
    return {
      fetchPath: this.path,
      title: place.name,
      dealTab: this.props.dealTab,
      dealType: this.props.dealType,
      gender: this.props.place.genderHint
    };
  };

  renderTimer = () => {
    var now = Moment();
    var endsAtDiff = Moment.duration(
      Moment(this.props.endAt).diff(now)
    ).asHours();
    var startsAtDiff = Moment.duration(
      Moment(this.props.startAt).diff(now)
    ).asHours();

    return this.props.timed == true && this.props.status == "3" ? (
      <Text style={styles.timer}>
        Ends in:{" "}
        {endsAtDiff > MaxTimerApply ? (
          Moment(this.props.endAt).fromNow(true)
        ) : (
          <Timer
            style={styles.timer}
            target={Moment(this.props.endAt).toArray()}/>
        )}
      </Text>
    ) : this.props.status == "1" ? (
      <Text style={styles.timer}>
        Starting in:{" "}
        {startsAtDiff > MaxTimerApply ? (
          Moment(this.props.startAt).fromNow(true)
        ) : (
          <Timer
            style={styles.timer}
            target={Moment(this.props.startAt).toArray()}/>
        )}
      </Text>
    ) : null;
  };

  renderImage = () => {
    const imageUrl = this.props.imageUrl
      ? this.props.imageUrl
      : this.props.products.length > 0
        ? this.props.products.map(p => p.imageUrl)[0]
        : "";
    const cardWidth = this.props.cardWidth || CardWidth;

    return (
      <ProgressiveImage
        source={{ uri: imageUrl }}
        style={{
          borderRadius: Sizes.InnerFrame / 2,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: 2 * cardWidth / 5,
          height: CardHeight
        }}/>
    );
  };

  onPress = () => {
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams()
    });
  };

  render() {
    const cardWidth = this.props.cardWidth || CardWidth;
    const collageWidth = 2 * cardWidth / 5;
    const infoWidth = 3 * (cardWidth - Sizes.InnerFrame) / 5;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.onPress}>
        <View style={[styles.card, { width: cardWidth }]}>
          <View style={[styles.image, { width: collageWidth }]}>
            {this.renderImage()}
          </View>
          <View style={{ padding: 5 }}>
            <View>
              <Text
                numberOfLines={2}
                style={[
                  styles.text,
                  { width: infoWidth, color: this.props.textColor }
                ]}>
                {this.props.description}
              </Text>
              <View style={{ maxWidth: infoWidth }}>{this.renderTimer()}</View>
              <View style={styles.infoContainer}>
                <Text style={{ fontSize: Sizes.SmallText }}>
                  {this.props.place.name.toUpperCase()}
                </Text>
                {this.props.info && (
                  <Text style={[styles.info, { maxWidth: infoWidth }]}>
                    {this.props.info}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={this.copyCodeButton}>
                <View style={[styles.getCode]}>
                  <MaterialCommunityIcon name="content-copy" size={Sizes.Text}>
                    <Text style={styles.buttonText}>{"Get Code"}</Text>
                  </MaterialCommunityIcon>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(DealCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    height: CardHeight
  },

  text: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  timer: {
    fontSize: Sizes.Text,
    fontWeight: Sizes.Medium,
    color: Colours.DarkBlue
  },

  buttons: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Sizes.InnerFrame / 2
  },

  buttonText: {
    fontSize: Sizes.SmallText,
    fontWeight: "300"
  },

  getCode: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: Sizes.InnerFrame
  },

  info: {
    fontSize: Sizes.SmallText,
    color: Colours.SubduedText
  },

  image: {
    borderRadius: Sizes.InnerFrame / 2,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
});
