import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
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
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { ApiInstance } from "~/src/global";
import { Product } from "~/src/stores";
import { SloppyView } from "~/src/components";
import ProductTileV2, { IMAGE_HEIGHT } from "~/src/components/ProductTileV2";
import { Sizes, Styles, Colours } from "~/src/constants";

// local
import { MinFollowCount } from "./store";
import { PulseOverlay } from "./components";

class FollowMerchant extends React.Component {
  constructor(props) {
    super(props);
    this.merchant = props.merchant;
    this.state = {
      isFollowing: props.merchant.isFavourite
    };
  }

  onPress = () => {
    this.setState(
      { isFollowing: !this.state.isFollowing },
      () =>
        this.state.isFollowing
          ? this.merchant.addFavourite()
          : this.merchant.removeFavourite()
    );
  };

  render() {
    const buttonText = this.state.isFollowing ? "Unfollow" : "Follow";
    const followStyle = this.state.isFollowing
      ? { color: Colours.EmphasizedText }
      : {};
    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <SloppyView style={{ marginRight: 10 }}>
          <Text style={[styles.follow, followStyle]}>{buttonText}</Text>
        </SloppyView>
      </TouchableWithoutFeedback>
    );
  }
}

@withNavigation
class Merchant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.merchant.id !== prevProps.merchant.id) {
      this.fetchProducts();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.merchant.id !== this.props.merchant.id
      || nextProps.merchant.isFavourite !== this.props.merchant.isFavourite
      || this.state.products.length == 0
      || nextState.products.filter(e => !this.state.products.includes(e))
    );
  }

  fetchProducts = async () => {
    const fetchPath = this.next
      ? this.next.url
      : `places/${
          this.props.merchant.id
        }/products?filter=categories,val=${JSON.stringify(
          this.props.categories
        )}`;
    ApiInstance.get(fetchPath, {
      limit: 5
    }).then(resolved => {
      if (!resolved.error) {
        this.setState({
          products: resolved.data.map(p => new Product(p))
        });
      }
    });
  };

  onPressPreview = () => {
    const fetchPath = `places/${
      this.props.merchant.id
    }/products?filter=categories,val=${JSON.stringify(this.props.categories)}`;

    this.props.navigation.push("ProductList", {
      fetchPath: fetchPath,
      title: `${this.props.merchant.name}`
    });
  };

  renderProduct = ({ item: product }) => {
    return <ProductTileV2 product={product} />;
  };

  render() {
    return (
      <View style={{ paddingBottom: Sizes.OuterFrame }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: Sizes.InnerFrame / 2,
            paddingHorizontal: Sizes.InnerFrame
          }}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row"
            }}>
            <View style={{ maxWidth: Sizes.Width / 3 }}>
              <Text numberOfLines={1} style={styles.name}>
                {this.props.merchant.name}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: Sizes.InnerFrame / 2
              }}>
              <Text style={styles.separatorDot}>·</Text>
            </View>
            <FollowMerchant
              key={`follow-${this.props.merchant.id}`}
              merchant={this.props.merchant}/>
          </View>
          <MaterialIcon.Button
            name="chevron-right"
            style={{ paddingRight: 0 }}
            iconStyle={{ marginRight: 0 }}
            underlayColor={Colours.Transparent}
            backgroundColor={Colours.Transparent}
            onPress={this.onPressPreview}
            size={Sizes.ActionButton}
            color={Colours.EmphasizedText}
            hitSlop={{
              top: Sizes.InnerFrame,
              bottom: Sizes.OuterFrame,
              left: Sizes.OuterFrame,
              right: Sizes.OuterFrame
            }}/>
        </View>
        <FlatList
          data={this.state.products}
          renderItem={this.renderProduct}
          ListEmptyComponent={
            <View style={{ height: IMAGE_HEIGHT + Sizes.InnerFrame }} />
          }
          ItemSeparatorComponent={() => (
            <View style={{ width: Sizes.InnerFrame }} />
          )}
          horizontal
          contentContainerStyle={{ padding: Sizes.InnerFrame }}
          directionalLockEnabled={true}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={p => `p${p.id}`}/>
      </View>
    );
  }
}
@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export class Merchants extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.onboardingStore;

    this._dataProvider = new DataProvider((r1, r2) => {
      return r1.id !== r2.id;
    });

    this._layoutProvider = new LayoutProvider(
      () => {
        return 0;
      },
      (type, dim) => {
        const separatorH = Sizes.InnerFrame + Sizes.OuterFrame + 1;
        const productTileH = IMAGE_HEIGHT + Sizes.InnerFrame * 4;
        const merchantH = Sizes.OuterFrame * 2 + productTileH + separatorH;

        dim.width = Sizes.Width;
        dim.height = merchantH;
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
    this.store.fetchMerchants();
  };

  renderItem = (type, data) => {
    return (
      <Merchant merchant={data} categories={this.store.selectedCategories} />
    );
  };

  onNext = () => {
    this.setState({ isProcessing: true });

    // save the users category
    this.store.storeUserCategory().then(resolved => {
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

  renderNextButton = () => {
    return this.store.favouriteCount >= MinFollowCount ? (
      <TouchableWithoutFeedback onPress={this.onNext}>
        <View style={Styles.RoundedButton}>
          <Text style={Styles.RoundedButtonText}>Next</Text>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <View style={Styles.RoundedButton}>
        <Text style={Styles.RoundedButtonText}>
          Follow {MinFollowCount - this.store.favouriteCount} More
        </Text>
      </View>
    );
  };

  renderFooter = () => {
    //Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    //The empty view can be removed once you've fetched all the data
    return this.store.isLoading ? (
      <ActivityIndicator style={{ margin: 10 }} size="large" color={"black"} />
    ) : (
      <View style={{ height: 60 }} />
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
          dataProvider={this._dataProvider.cloneWithRows(
            this.store.merchants.slice()
          )}
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
    bottom: Sizes.ScreenBottom + Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
