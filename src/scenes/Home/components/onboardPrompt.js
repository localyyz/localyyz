import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text
} from "react-native";
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import PropType from "prop-types";
import * as Animatable from "react-native-animatable";

// custom
import { OS, GA, ApiInstance } from "~/src/global";
import { Icons, Styles, Colours, Sizes } from "localyyz/constants";

class CardButton extends React.Component {
  static propTypes = {
    onPress: PropType.func.isRequired,
    text: PropType.string,
    selectedText: PropType.string
  };

  constructor(props) {
    super(props);
    this.state = { processing: false };
  }

  onPress = () => {
    this.setState({ processing: true }, () => {
      this.props.onPress(this.props.value).then(resolved => {
        setTimeout(
          () =>
            this.setState(
              {
                success: resolved.success,
                selected: resolved.success,
                processing: false
              },
              () => {
                this.state.success && this.props.onComplete();
              }
            ),
          1000
        );
      });
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View
          style={[
            styles.promptButton,
            {
              backgroundColor: this.state.selected
                ? Colours.GrassRootGreen
                : Colours.Primary
            }
          ]}>
          <Text style={styles.buttonText}>
            {this.state.selected ? this.props.selectedText : this.props.text}
          </Text>
          <View
            pointerEvents="none"
            style={[
              styles.activityOverlay,
              {
                backgroundColor: this.state.processing
                  ? Colours.WhiteTransparent
                  : null
              }
            ]}>
            <ActivityIndicator
              size="small"
              color={Colours.Text}
              animating={this.state.processing}/>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
  }

  onComplete = () => {
    this.setState({ complete: true }, () => {
      this.props.onComplete && this.props.onComplete();
    });
  };

  render() {
    return (
      <Animatable.View
        animation={this.state.complete ? "fadeOut" : null}
        duration={1500}
        style={{
          flex: 1,
          backgroundColor: Colours.Foreground,
          borderRadius: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          minHeight: Sizes.Height / 4,
          justifyContent: "center",
          alignItems: "center",
          padding: Sizes.InnerFrame,
          marginVertical: Sizes.InnerFrame
        }}>
        <Text style={styles.text}>{this.props.title}</Text>
        <Text style={styles.subtext}>{this.props.subtitle}</Text>
        <View style={{ ...Styles.Horizontal }}>
          {this.props.actions.map((c, i) => {
            return (
              <CardButton
                key={`button${i}-${c.value}`}
                {...c}
                onPress={this.props.onPress}
                onComplete={this.onComplete}/>
            );
          })}
        </View>
        {this.state.complete ? (
          <Animatable.View
            animation={this.state.complete ? "bounceIn" : null}
            pointerEvents="none"
            style={[
              styles.activityOverlay,
              { backgroundColor: Colours.WhiteTransparent }
            ]}>
            {Icons.CheckMark({ size: 150, color: Colours.GrassRootGreen })}
          </Animatable.View>
        ) : null}
      </Animatable.View>
    );
  }
}

@inject(stores => ({
  savePreferences: stores.userStore.savePreferences,
  preference: stores.userStore.prf
}))
@observer
class OnboardPrompt extends React.Component {
  // this component checks for user's preferences
  // and prompts the user for answers

  gotoOnboarding = () => {
    this.props.navigation.navigate("Personalize");
  };

  onSelectGender = value => {
    GA.trackEvent("personalize", "select", `gender - ${value}`, 0);
    //OS.sendTags({ gender: [value] });
    return this.props.savePreferences({ gender: [value] });
  };

  get genderCard() {
    return (
      <Card
        title="What are you shopping for?"
        subtitle="(You can change this later in settings)"
        onPress={this.onSelectGender}
        onComplete={this.props.onComplete}
        actions={[
          {
            value: "woman",
            text: "👩 Women's",
            selectedText: "🙋 Women's",
            allowToggle: true
          },
          {
            value: "man",
            text: "👨 Men's",
            selectedText: "🙋‍♂️ Men's",
            allowToggle: true
          }
        ]}/>
    );
  }

  render() {
    let prompt;
    switch (this.props.id) {
      case "gender":
        prompt = this.genderCard;
        break;
      default:
        prompt = this.genderCard;
    }

    return prompt;
  }
}

export default withNavigation(OnboardPrompt);

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //backgroundColor: Colours.Foreground,
    //justifyContent: "center",
    //alignItems: "center",
    //paddingHorizontal: Sizes.InnerFrame
  },

  text: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center",
    padding: 8
  },

  subtext: {
    ...Styles.Subtext
  },

  promptButton: {
    ...Styles.RoundedButton,
    flex: 1,
    marginHorizontal: Sizes.InnerFrame / 2,
    marginVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame * 2
  },

  buttonText: {
    ...Styles.RoundedButtonText,
    fontSize: Sizes.SmallText
  },

  activityOverlay: {
    ...Styles.Overlay,
    justifyContent: "center",
    alignItems: "center"
  }
});
