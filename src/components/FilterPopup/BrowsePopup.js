import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text
} from "react-native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import Browse from "../Filter/Browse";

// third party
import PropTypes from "prop-types";
import { observer, Provider } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// constants
const BOTTOM_MARGIN = Sizes.OuterFrame * 3;

@observer
export default class BrowsePopup extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,

    // parent specifies the content style
    contentStyle: PropTypes.any,
    onClose: PropTypes.func
  };

  static defaultProps = {
    contentStyle: {}
  };

  render() {
    return (
      <Provider filterStore={this.props.store}>
        <View style={styles.container} pointerEvents="box-none">
          <ScrollView
            style={styles.content}
            contentContainerStyle={[
              this.props.contentStyle,
              {
                paddingBottom: BOTTOM_MARGIN * 2
              }
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Browse />
            <View pointerEvents="box-none" style={styles.footer}>
              <LinearGradient
                pointerEvents="box-none"
                colors={[Colours.WhiteTransparent, Colours.Transparent]}
                start={{ y: 1, x: 0 }}
                end={{ y: 0, x: 0 }}
                style={styles.gradient}>
                <View style={styles.toggle}>
                  <TouchableOpacity onPress={this.props.onClose}>
                    <View style={styles.button}>
                      <Text style={styles.label}>
                        Close
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  content: {
    padding: Sizes.OuterFrame
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  gradient: {
    paddingBottom: Sizes.ScreenBottom
  },

  toggle: {
    alignItems: "center"
  },

  button: {
    ...Styles.RoundedButton,
    alignItems: "center",
    margin: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame * 2,
    backgroundColor: Colours.PositiveButton,
    marginBottom: Sizes.InnerFrame * 3
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
