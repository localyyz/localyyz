import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

// third party
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { ConstrainedAspectImage, ProgressBar } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";

// custom
import ActiveDealUIStore from "./store";

@inject(stores => ({
  dealStore: stores.dealStore
}))
@observer
export default class ActiveCard extends React.Component {
  constructor(props) {
    super(props);
    this.store = new ActiveDealUIStore(this.props.deal);

    // bindings
    this.renderProduct = this.renderProduct.bind(this);
  }

  renderProduct({ item: product, index }) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {index > 0 ? product.brand : this.store.deal.name}
          </Text>
          <Text style={styles.text}>
            {index > 0 ? product.title : this.store.deal.description}
          </Text>
        </View>
        <View style={styles.activeContent}>
          {product.associatedPhotos && product.associatedPhotos.length ? (
            <TouchableOpacity
              onPress={() =>
                this.props.onPressImage(product.associatedPhotos[0].imageUrl)
              }>
              <ConstrainedAspectImage
                source={{ uri: product.associatedPhotos[0].imageUrl }}
                constrainHeight={Sizes.Height / 4}/>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Product", {
                product: product,

                // used for now timer sync
                dealStore: this.props.dealStore,

                // deal data itself
                activeDealStore: this.store
              })
            }>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>
                {`Buy — ${toPriceString(
                  product.price,
                  product.place.currency
                )}`}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.social}>
            <Text style={styles.socialLabel}>
              {`${
                this.store.deal.usersViewing
                  ? `${this.store.deal.usersViewing} currently viewing — `
                  : ""
              }${
                this.store.deal.quantityAvailable
                  ? `${this.store.deal.quantityAvailable} available`
                  : "sold out"
              }`}
            </Text>
            <ProgressBar
              percentage={this.store.deal.percentageClaimed}
              progress={this.store.progress}/>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <Provider activeDealStore={this.store}>
        <FlatList
          data={this.store.products ? this.store.products.slice() : []}
          renderItem={this.renderProduct}
          keyExtractor={product => `dotd-${product.id}`}/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  card: {
    padding: Sizes.InnerFrame
  },

  activeContent: {
    alignItems: "center"
  },

  social: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },

  socialLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText,
    color: Colours.Primary,
    marginBottom: Sizes.InnerFrame
  },

  button: {
    ...Styles.RoundedButton,
    paddingHorizontal: Sizes.InnerFrame,
    margin: Sizes.InnerFrame
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    marginBottom: Sizes.InnerFrame / 2
  },

  text: {
    ...Styles.Text
  }
});
