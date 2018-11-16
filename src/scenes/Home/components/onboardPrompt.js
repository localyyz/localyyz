import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { withNavigation } from "react-navigation";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { Placeholder as ProductTilePlaceholder } from "~/src/components/ProductTileV2";
import { BadgeType } from "~/src/components/ProductTileV2/Badge";

class OnboardPrompt extends React.Component {
  gotoOnboarding = () => {
    this.props.navigation.navigate("Personalize");
  };

  render() {
    return (
      <View style={styles.container}>
        <ProductTilePlaceholder scale={0.9} badgeType={BadgeType.Unknown} />
        <TouchableWithoutFeedback onPress={this.gotoOnboarding}>
          <View>
            <Text style={styles.text}>Nothing in your feed just yet!</Text>
            <Text style={styles.subtext}>
              Help us personalize Localyyz for you.
            </Text>
            <View style={styles.promptButton}>
              <Text style={styles.buttonText}>Start Personalizing</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default withNavigation(OnboardPrompt);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Sizes.InnerFrame
  },

  text: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center",
    padding: 8
  },

  subtext: {
    ...Styles.SmallText,
    textAlign: "center"
  },

  promptButton: {
    ...Styles.RoundedButton,
    marginVertical: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame
  },

  buttonText: {
    ...Styles.RoundedButtonText,
    fontSize: Sizes.Text
  }
});
