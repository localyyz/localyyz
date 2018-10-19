import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import DealType from "./DealType";
import FeaturedDealsCarousel from "./FeaturedDealsCarousel";

@observer
export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FeaturedDealsCarousel />
        <DealType />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  }
});
