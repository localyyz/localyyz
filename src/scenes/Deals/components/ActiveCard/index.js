import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { computed } from "mobx";
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { ConstrainedAspectImage, ProgressBar } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

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
  }

  @computed
  get product() {
    return this.store.products[0];
  }

  render() {
    return this.product ? (
      <Provider activeDealStore={this.store}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>{this.store.deal.name}</Text>
            <Text style={styles.text}>{this.store.deal.description}</Text>
          </View>
          <View style={styles.activeContent}>
            <ConstrainedAspectImage
              source={{ uri: this.product.imageUrl }}
              constrainHeight={Sizes.Height / 4}/>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Product", {
                  product: this.product,

                  // used for now timer sync
                  dealStore: this.props.dealStore,

                  // deal data itself
                  activeDealStore: this.store
                })
              }>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>
                  {`Buy now $${this.product.price}`}
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
              <ProgressBar progress={this.store.progress} />
            </View>
          </View>
        </View>
      </Provider>
    ) : null;
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
