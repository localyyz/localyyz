import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import Filter, { ProductCount } from "../Filter";

// third party
import PropTypes from "prop-types";
import { observer, Provider } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// constants
const BOTTOM_MARGIN = Sizes.OuterFrame * 3;

@observer
export default class FilterPopup extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,

    // parent specifies the content style
    contentStyle: PropTypes.any,
    onClose: PropTypes.func
  };

  static defaultProps = {
    contentStyle: {}
  };

  componentDidMount(){
    this.props.store.refresh();
  }

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
            <Filter/>
          </ScrollView>
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
                    <ProductCount labelStyle={styles.label} />
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
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
    backgroundColor: Colours.PositiveButton
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
