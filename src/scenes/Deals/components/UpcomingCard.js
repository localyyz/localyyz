import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import Moment from "moment";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

export default class UpcomingCard extends React.Component {
  render() {
    return (
      <View style={[styles.cardContainer, styles.card]}>
        <Text style={styles.title}>
          {Moment().to(Moment(this.props.start))}
        </Text>
        <Text style={styles.text}>{this.props.name}</Text>
      </View>
    );
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
