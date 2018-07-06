import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import Moment from "moment";
import { observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";

@observer
export default class UpcomingCard extends React.Component {
  render() {
    let cardWidth = Sizes.Width - Sizes.InnerFrame * 2;
    return this.props.deal ? (
      <View>
        {this.props.deal.imageUrl ? (
          <ConstrainedAspectImage
            constrainWidth={cardWidth}
            sourceWidth={this.props.deal.imageWidth || null}
            sourceHeight={this.props.deal.imageHeight || null}
            source={{ uri: this.props.deal.imageUrl }}/>
        ) : null}
        <View style={[styles.cardContainer, styles.card]}>
          <Text style={styles.title}>
            {Moment(this.props.deal.startAt).calendar(this.props.now, {
              sameDay: "[Today]",
              nextDay: "[Tomorrow]",
              nextWeek: "dddd",
              sameElse: "DD/MM/YYYY"
            })}
          </Text>
          <Text style={styles.text}>{this.props.deal.name}</Text>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  card: {
    padding: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    marginBottom: Sizes.InnerFrame / 2
  },

  text: {
    ...Styles.Text
  }
});
