import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

// custom
import { Styles, Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";
import { BaseScene, Filter } from "localyyz/components";

// temp (TODO: move this into its own component lib)
import { ProductCount } from "../../../components/Filter";

// third party
import { observer, Provider } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

@observer
export default class FilterMain extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.close = this.close.bind(this);
  }

  get settings() {
    return (
      (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || this.props
    );
  }

  componentDidMount() {
    this.settings.store && this.settings.store.refresh();
  }

  close() {
    return this.settings.onBack
      ? this.settings.onBack()
      : this.props.navigation.goBack(null);
  }

  render() {
    return (
      <Provider filterStore={this.settings.store}>
        <View style={styles.container}>
          <BaseScene
            iconType="close"
            backAction={this.close}
            title="Filter"
            style={styles.content}>
            <Filter style={styles.filter} />
          </BaseScene>
          <View pointerEvents="box-none" style={styles.footer}>
            <LinearGradient
              pointerEvents="box-none"
              colors={[Colours.WhiteTransparent, Colours.Transparent]}
              start={{ y: 1, x: 0 }}
              end={{ y: 0, x: 0 }}
              style={styles.gradient}>
              <View style={styles.toggle}>
                <TouchableOpacity onPress={this.close}>
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
    marginBottom: Sizes.ScreenBottom + NAVBAR_HEIGHT
  },

  content: {
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.InnerFrame
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
    backgroundColor: Colours.Action
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  filter: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
