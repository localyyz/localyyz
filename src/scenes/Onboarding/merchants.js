import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { observer, inject } from "mobx-react/native";
import {
  withNavigation,
  StackActions,
  NavigationActions
} from "react-navigation";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from "recyclerlistview";

import { IMAGE_HEIGHT } from "~/src/components/ProductTileV2";
import { Sizes, Styles, Colours } from "~/src/constants";

// local
import Merchant from "./components/merchant";
import { PulseOverlay } from "./components";

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export class Merchants extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    gesturesEnabled: false
  });

  constructor(props) {
    super(props);
    this.store = props.onboardingStore;

    this._dataProvider = new DataProvider((r1, r2) => {
      return r1.id !== r2.id;
    });

    this._layoutProvider = new LayoutProvider(
      index => {
        if (index == 0) {
          return 1;
        }
        return 2;
      },
      (type, dim) => {
        const separatorH = Sizes.InnerFrame + Sizes.OuterFrame + 1;
        const productTileH = IMAGE_HEIGHT + Sizes.InnerFrame * 4;
        const merchantH = Sizes.OuterFrame * 2 + productTileH + separatorH;

        switch (type) {
          case 1:
            dim.width = Sizes.Width;
            dim.height = 50;
            break;
          case 2:
            dim.width = Sizes.Width;
            dim.height = merchantH;
            break;
          default:
            dim.width = 0;
            dim.height = 0;
        }
      }
    );

    this.state = {
      isProcessing: true,
      processingSubtitle: "Finding the best merchants for you..."
    };
  }

  componentDidMount() {
    this.store.fetchMerchants().then(() => {
      setTimeout(() => {
        this.setState({ isProcessing: false, processingSubtitle: null });
      }, 1000);
    });
  }

  onEndReached = () => {
    this.store.fetchNextPage();
  };

  renderItem = (type, data) => {
    switch (type) {
      case 1:
        return (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Here are some stores we think you would love...
            </Text>
          </View>
        );
      case 2:
        return <Merchant merchant={data} store={this.store} />;
    }
  };

  onNext = () => {
    this.setState({
      isProcessing: true,
      processingSubtitle: "Putting together your feed..."
    });

    // save the users category
    this.store.saveSelectedOptions().then(resolved => {
      setTimeout(() => {
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
      }, 4000);
    });
  };

  onBack = () => {
    this.props.navigation.popToTop();
  };

  renderNextButton = () => {
    return (
      <View
        pointerEvents="box-none"
        style={{
          alignItems: "center",
          width: Sizes.Width
        }}>
        <View style={{ flexDirection: "row", width: Sizes.Width }}>
          <TouchableWithoutFeedback onPress={this.onBack}>
            <View
              style={{
                width: Sizes.Width / 4,
                backgroundColor: Colours.SubduedForeground,
                alignItems: "center",
                paddingVertical: Sizes.InnerFrame
              }}>
              <Text style={Styles.RoundedButtonText}>Back</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.onNext}>
            <View
              style={{
                width: 3 * Sizes.Width / 4,
                backgroundColor: Colours.PositiveButton,
                alignItems: "center",
                paddingVertical: Sizes.InnerFrame
              }}>
              <Text style={Styles.RoundedButtonText}>
                Skip, show me everything
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <ActivityIndicator
        animating={this.store.isLoading}
        size="large"
        style={{ height: 60, width: Sizes.Width }}
        color={"black"}/>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <RecyclerListView
          scrollViewProps={{
            directionalLockEnabled: true,
            scrollEventThrottle: 16
          }}
          style={styles.list}
          dataProvider={this._dataProvider.cloneWithRows([
            {},
            ...this.store.merchants.slice()
          ])}
          layoutProvider={this._layoutProvider}
          rowRenderer={this.renderItem}
          renderFooter={this.renderFooter}
          onEndReached={this.onEndReached}/>
        <View pointerEvents="box-none" style={styles.footer}>
          {this.renderNextButton()}
        </View>
        <PulseOverlay
          subtitle={this.state.processingSubtitle}
          isProcessing={this.state.isProcessing}/>
      </View>
    );
  }
}

export default withNavigation(Merchants);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.ScreenTop
  },

  header: {
    height: 50,
    paddingHorizontal: Sizes.InnerFrame
  },

  headerText: {
    ...Styles.Text,
    ...Styles.Title
  },

  list: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  name: {
    fontSize: Sizes.Text
  },

  separatorDot: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    fontSize: Sizes.Text
  },

  follow: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    fontSize: Sizes.Text,
    color: Colours.PositiveButton
  },

  footer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Sizes.ScreenBottom,
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
