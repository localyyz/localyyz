import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from "react-native";

// third party
import { observable, runInAction } from "mobx";
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import { ApiInstance } from "localyyz/global";
import { Product } from "localyyz/stores";
import { box } from "~/src/helpers";
import { Styles, Sizes } from "~/src/constants";
import ProductTileV2, { PADDING } from "~/src/components/ProductTileV2";

// local
import ListHeader from "./ListHeader";
import MoreFooter from "./MoreFooter";

@withNavigation
class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ProductTileV2
        onPress={() =>
          this.props.navigation.push("Product", {
            product: this.props.product
          })
        }
        product={this.props.product}/>
    );
  }
}

@inject(stores => ({
  wasLoginSuccessful: stores.loginStore._wasLoginSuccessful,
  genderFilter: stores.userStore.genderPreference
}))
@observer
export class List extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    hideHeader: PropTypes.bool,
    description: PropTypes.string,
    withMargin: PropTypes.bool,
    limit: PropTypes.number,

    // more button
    fetchPath: PropTypes.string,
    fetchFrom: PropTypes.string
  };

  @box isLoading = true;
  @observable products = [];

  componentDidMount() {
    // setup the items
    ApiInstance.get(this.props.fetchFrom, {
      filter: this.props.genderFilter
        ? `gender,val=${this.props.genderFilter}`
        : null,
      limit: this.props.limit
    })
      .then(resolved => {
        if (!resolved.error) {
          runInAction("[ACTION] fetch collection", () => {
            this.products = (resolved.data || []).map(p => new Product(p));
          });
        }
        this.isLoading = false;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  static defaultProps = {
    title: "",
    hideHeader: false,
    description: "",
    withMargin: false
  };

  get renderMoreButton() {
    return this.products.length > 0 ? <MoreFooter {...this.props} /> : null;
  }

  renderItem = ({ item: product, index }) => {
    const tileStyle = index % 2 == 0 ? styles.tileEven : styles.tileOdd;
    return (
      <View style={tileStyle}>
        <ListItem product={product} />
      </View>
    );
  };

  gotoOnboarding = () => {
    this.props.navigation.navigate("Onboarding", {
      onFinish: this.props.navigation.goBack
    });
  };

  renderOnboardingPrompt = () => {
    return (
      <TouchableWithoutFeedback onPress={this.gotoOnboarding}>
        <View>
          <Text style={styles.emptyText}>Nothing in your feed yet!</Text>
          <Text style={styles.emptyText}>
            Help us personalize Localyyz for you.
          </Text>
          <View
            style={[
              Styles.RoundedButton,
              { marginVertical: Sizes.InnerFrame }
            ]}>
            <Text style={Styles.RoundedButtonText}>Start Personalizing</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // TODO make home into three parts:
  // - feed
  // - discover
  // - sale
  renderEmptyComponent = () => {
    return this.isLoading ? (
      <ActivityIndicator size="large" />
    ) : (
      <View style={styles.emptyContainer}>
        {this.props.id === "feed" ? (
          this.renderOnboardingPrompt()
        ) : (
          <Text style={styles.emptyText}>
            Nothing here yet. Try again later.
          </Text>
        )}
      </View>
    );
  };

  render() {
    // TODO: _position animation
    // TODO: _motion animation
    const { ...rest } = this.props;
    return (
      <View>
        {!this.props.hideHeader ? <ListHeader {...rest} /> : null}
        <FlatList
          keyExtractor={item => `product-${item.id}`}
          renderItem={this.renderItem}
          extraData={{ isLoading: this.isLoading }}
          ListFooterComponent={this.renderMoreButton}
          ListEmptyComponent={this.renderEmptyComponent}
          contentContainerStyle={styles.content}
          data={this.products.slice()}
          numColumns={2}/>
      </View>
    );
  }
}

export default withNavigation(List);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Sizes.InnerFrame
  },

  emptyText: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    textAlign: "center"
  },

  tileEven: {
    paddingLeft: PADDING,
    paddingRight: PADDING / 2
  },

  tileOdd: {
    paddingLeft: PADDING / 2,
    paddingRight: PADDING
  }
});
