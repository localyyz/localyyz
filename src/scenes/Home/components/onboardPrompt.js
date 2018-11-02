import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { withNavigation } from "react-navigation";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";

class OnboardPrompt extends React.Component {
  gotoOnboarding = () => {
    this.props.navigation.navigate("Onboarding", {
      onFinish: this.props.navigation.goBack
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.gotoOnboarding}>
          <View>
            <Text style={styles.text}>Nothing in your feed yet!</Text>
            <Text style={styles.text}>
              Help us personalize Localyyz for you.
            </Text>
            <View style={styles.promptButton}>
              <Text style={Styles.RoundedButtonText}>Start Personalizing</Text>
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
    textAlign: "center"
  },
  promptButton: {
    ...Styles.RoundedButton,
    marginVertical: Sizes.InnerFrame
  }
});
