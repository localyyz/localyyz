import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from "react-native";

// custom
import { Colours, Styles, Sizes } from "~/src/constants";

// third party
import { observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { PropTypes as mobxPropTypes } from "mobx-react/native";

// local
import ListItem from "./ListItem";
import ListHeader from "./ListHeader";
import MoreFooter from "./MoreFooter";

@observer
export class List extends React.Component {
  static propTypes = {
    // listData input type take a look at home store
    //  fetchFeaturedProducts
    //  fetchDiscountedProducts
    // and https://github.com/mobxjs/mobx-utils#lazyobservable
    listData: mobxPropTypes.objectOrObservableObject,
    title: PropTypes.string.isRequired,
    hideHeader: PropTypes.bool,
    description: PropTypes.string,
    withMargin: PropTypes.bool,
    limit: PropTypes.number,

    // more button
    fetchPath: PropTypes.string,
    numProducts: PropTypes.number
  };

  static defaultProps = {
    title: "",
    hideHeader: false,
    description: "",
    withMargin: false
  };

  get renderMoreButton() {
    return this.props.listData.length > 0 ? (
      <MoreFooter {...this.props} />
    ) : null;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.numProducts !== this.props.numProducts;
  }

  renderItem = ({ item: product }) => {
    return <ListItem product={product} />;
  };

  gotoOnboarding = () => {
    this.props.navigation.navigate("Onboarding", {
      onFinish: this.props.navigation.goBack
    });
  };

  // TODO: this really shouldn't be abstracted here. but until
  // home is completely redone. let's leave it here for now.
  renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        {this.props.id === "feed" ? (
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
                <Text style={Styles.RoundedButtonText}>Start Onboarding</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    const { listData, withMargin, ...rest } = this.props;
    return (
      <View>
        {!this.props.hideHeader ? <ListHeader {...rest} /> : null}
        <View style={withMargin ? styles.listWrapper : {}}>
          <FlatList
            keyExtractor={item => `product-${item.id}`}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderMoreButton}
            ListEmptyComponent={this.renderEmptyComponent}
            data={listData && listData.slice()}
            numColumns={2}/>
        </View>
      </View>
    );
  }
}

export default withNavigation(List);

const styles = StyleSheet.create({
  listWrapper: {
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

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
  }
});
