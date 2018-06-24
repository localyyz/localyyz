import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";
import Filter, { ProductCount } from "../Filter";
import UppercasedText from "../UppercasedText";
import PropTypes from "prop-types";

// third party
import {
  View as AnimatableView,
  createAnimatableComponent
} from "react-native-animatable";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { inject, observer } from "mobx-react/native";

export class FilterPopupButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func.isRequired
  };

  static defaultProps = {
    text: "Filter / Sort"
  };

  render() {
    return (
      <View style={styles.toggle} pointerEvents="box-none">
        <View style={styles.gradient} pointerEvents="box-none">
          <TouchableOpacity onPress={this.props.onPress}>
            <AnimatableView
              animation="fadeIn"
              duration={500}
              delay={1000}
              style={styles.toggleContainer}>
              <MaterialIcon
                name="sort"
                size={Sizes.TinyText}
                color={Colours.Text}/>
              <UppercasedText style={styles.toggleLabel}>
                {this.props.text}
              </UppercasedText>
            </AnimatableView>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class FilterContent extends React.Component {
  render() {
    return (
      <View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            this.props.contentStyle,
            {
              paddingBottom: Sizes.InnerFrame * 5
            }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={this.props.scrollEnabled}>
          <Filter />
        </ScrollView>

        <AnimatableView
          animation={"fadeIn"}
          delay={300}
          style={[styles.toggle, styles.toggleBottom]}>
          <TouchableOpacity activeOpacity={1} onPress={this.props.onClose}>
            <ProductCount labelStyle={{ color: "white" }} />
          </TouchableOpacity>
        </AnimatableView>
      </View>
    );
  }
}

const Content = createAnimatableComponent(FilterContent);

@inject(stores => ({
  scrollEnabled: stores.filterStore.scrollEnabled,
  toggleNavBar: visible => {
    visible ? stores.navbarStore.show() : stores.navbarStore.hide();
  }
}))
@observer
export default class FilterPopup extends React.Component {
  static propTypes = {
    // mobx
    // NOTE: some component else where may lock up
    // the filter scroll.
    // for example: Price range will hijack the scroll
    scrollEnabled: PropTypes.bool,

    // parent specifies the content style
    contentStyle: PropTypes.any,
    // is filter popup initially visible
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    isVisible: false,
    scrollEnabled: true,
    contentStyle: {},
    onFilter: () => {}
  };

  // creates a new filter store inherited from parent store
  // that can fetch products based on filter params
  static getNewStore(parentStore) {
    return Filter.getNewStore(parentStore);
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible
    };

    // bindings
    this.toggle = this.toggle.bind(this);
  }

  toggle(show) {
    show ? this.props.toggleNavBar(false) : this.props.toggleNavBar(true);

    this.setState({
      isVisible: show
    });
  }

  render() {
    return (
      <View style={styles.cover} pointerEvents="box-none">
        <StatusBar hidden={this.state.isVisible} />
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: Sizes.ScreenBottom + Sizes.InnerFrame - 2
          }}>
          <FilterPopupButton onPress={() => this.toggle(true)} />
        </View>

        {/* TODO:
            bug fix: skip animating on mount:
            https://github.com/oblador/react-native-animatable/pull/194 */}

        {this.state.isVisible ? (
          <Content
            useNativeDriver
            animation={{
              from: this.state.isVisible
                ? { opacity: 0, translateY: Sizes.Height }
                : { opacity: 1, translateY: 0 },
              to: this.state.isVisible
                ? { opacity: 1, translateY: 0 }
                : { opacity: 0, translateY: Sizes.Height }
            }}
            duration={300}
            delay={0}
            contentStyle={this.props.contentStyle}
            scrollEnabled={this.props.scrollEnabled}
            onClose={() => this.toggle(false)}/>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cover: {
    flex: 1
  },

  content: {
    padding: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  toggle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  toggleBottom: {
    bottom: -Sizes.OuterFrame,
    backgroundColor: Colours.Primary,
    padding: Sizes.InnerFrame / 3
  },

  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 6
  },

  toggleContainer: {
    ...Styles.Horizontal,
    margin: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.WhiteTransparent,
    shadowColor: Colours.DarkTransparent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },

  toggleLabel: {
    ...Styles.Text,
    ...Styles.Medium,
    marginLeft: Sizes.InnerFrame / 2
  }
});
