import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text
} from "react-native";
import { observer, Provider } from "mobx-react/native";
import { StackActions, NavigationActions } from "react-navigation";
import EntypoIcon from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";

import { Sizes, Styles, Colours } from "~/src/constants";

// slides
import Outro from "./slides/outro";
import Question from "./slides/question";
import Store from "./store";

@observer
export default class PersonalizeScene extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    gesturesEnabled: false
  });

  constructor(props) {
    super(props);
    this.store = new Store();
    this.state = { reachedEnd: false };
  }

  onFinish = () => {
    this.store.saveSelectedOptions().then(resolved => {
      if (resolved.success) {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 1,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: "App"
              }),
              NavigationActions.navigate({
                routeName: "App",
                action: NavigationActions.navigate({
                  routeName: "Home"
                })
              })
            ]
          })
        );
      }
    });
  };

  onScroll = ({
    nativeEvent: { layoutMeasurement, contentOffset, contentSize }
  }) => {
    // reached end?
    this.setState({
      reachedEnd:
        layoutMeasurement.height + contentOffset.y
        >= contentSize.height - Sizes.Height / 3
    });
  };

  render() {
    const slides = this.store.questions.map(item => {
      const key = `slide${item.id}`;
      switch (item.id) {
        case "outro":
          return <Outro key={key} {...item} />;
        case "style":
          return <Question {...item} data={this.store.styles} key={key} />;
        default:
          return <Question {...item} key={key} />;
      }
    });

    return (
      <Provider onboardingStore={this.store}>
        <View style={styles.container}>
          <ScrollView
            style={styles.content}
            scrollEventThrottle={64}
            pagingEnabled={true}
            onScroll={this.onScroll}>
            {slides}
          </ScrollView>

          <View style={styles.button} pointerEvents="box-none">
            {this.store.canFinish ? (
              <View style={styles.inner}>
                <TouchableOpacity onPress={this.onFinish}>
                  <View style={styles.actionButton}>
                    <Text style={Styles.RoundedButtonText}>Finish</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              !this.state.reachedEnd && (
                <Animatable.View
                  animation="bounce"
                  iterationCount="infinite"
                  duration={2500}
                  pointerEvents="none"
                  style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: Sizes.SmallText,
                      color: Colours.Foreground
                    }}>
                    Scroll
                  </Text>
                  <EntypoIcon
                    name="chevron-thin-down"
                    color={Colours.Foreground}
                    size={Sizes.ActionButton}/>
                </Animatable.View>
              )
            )}
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.BlueSteel
  },

  content: {},

  button: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Sizes.Height / 8,
    marginHorizontal: Sizes.OuterFrame,
    justifyContent: "center"
  },

  inner: {
    flex: 1
  },

  actionButton: {
    ...Styles.RoundedButton,
    width: Sizes.Width - 2 * Sizes.OuterFrame,
    alignItems: "center",
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  }
});
