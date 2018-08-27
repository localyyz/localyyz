import React from "react";
import { View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

// custom
import { IS_DEALS_SUPPORTED, NAVBAR_HEIGHT } from "localyyz/constants";
import TabBar from "./components/TabBar";
import { onlyIfLoggedIn } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

// local
import { Toggler } from "./components";

@inject(stores => ({
  userStore: stores.userStore,
  fetch: () => stores.cartStore.fetch(),
  isVisible: stores.navbarStore.isVisible
}))
@observer
export class NavBar extends React.Component {
  static HEIGHT = NAVBAR_HEIGHT;
  static Toggler = Toggler;
  static propTypes = {
    // mobx injected
    userStore: PropTypes.object.isRequired,
    fetch: PropTypes.func.isRequired,
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    isVisible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      // highlight active button
      activeButton: this.tabs[0].id,

      lastNontoggleableButton: null
    };

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    onlyIfLoggedIn({ hasSession: this.props.hasSession }, () =>
      this.props.fetch()
    );
  }

  onPress(button, callback, closePullup = true, toggleable = false) {
    // 1. pressing tab button multiple times should reset back to index of the
    //    tab
    // 2. toggleable tab button should reset
    this.setState(
      {
        activeButton:
          this.state.activeButton === button
            ? toggleable ? this.state.lastNontoggleableButton : button
            : button,
        lastNontoggleableButton: toggleable
          ? this.state.lastNontoggleableButton
          : button
      },
      // TODO: optimization, callback navigation rerenders
      () => callback && callback()
    );

    // chaining
    return true;
  }

  get tabs() {
    // NOTE: this is here because IS_DEALS_SUPPORTED will
    // return undefined when called outside of component...
    return [
      { id: "home", icon: "hanger", label: "Explore", tabKey: "Root" },
      {
        id: "search",
        icon: "search",
        iconType: "fontAwesome",
        label: "Search",
        tabKey: "SearchBrowse"
      },
      ...(IS_DEALS_SUPPORTED
        ? [
            {
              id: "deals",
              icon: "bolt",
              iconType: "fontAwesome",
              label: "Flash",
              tabKey: "Deals"
            }
          ]
        : []),
      {
        id: "settings",
        icon: "more-horiz",
        iconType: "material",
        label: "You",
        tabKey: "Settings"
      },
      {
        id: "cart",
        icon: "shopping-basket",
        iconType: "entypo",
        label: "Cart",
        tabKey: "Cart"
      }
    ];
  }

  render() {
    return (
      this.props.isVisible && (
        <View pointerEvents="box-none">
          <TabBar
            height={NAVBAR_HEIGHT}
            tabs={this.tabs}
            onPress={this.onPress}
            activeButton={this.state.activeButton}/>
        </View>
      )
    );
  }
}

export default withNavigation(NavBar);
