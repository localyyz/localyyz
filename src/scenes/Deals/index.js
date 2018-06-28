import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { BaseScene } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

// local
import { Background, DealCard } from "./components";
import DealsUIStore from "./store";

// constants
const FAQ = [
  {
    title: "How do these sales work?",
    description:
      "Every single day at noon (EST), we'll choose and release a product to heavily discount to $30 (USD) on this page for a hour long until it sells out"
  },
  {
    title: "Can I buy more than one?",
    description:
      "Flash sales operate on a first-served and limited quantity basis"
  }
];

export default class DealsScene extends React.Component {
  constructor(props) {
    super(props);

    // store
    this.store = new DealsUIStore();

    // bindings
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentDidMount() {
    this.store.fetch();
  }

  renderHeader() {
    return <Background onComplete={this.store.fetch} />;
  }

  render() {
    return (
      <Provider dealStore={this.store}>
        <View style={styles.wrapper}>
          <View style={styles.overlay} pointerEvents="box-none">
            <BaseScene
              title="Today's deal"
              header={this.renderHeader()}
              idleStatusBarStatus="light-content">
              <View style={styles.container}>
                <Deals navigation={this.props.navigation} />
                {FAQ.map((faq, i) => (
                  <FAQItem id={`faq-${i}`} title={faq.title}>
                    {faq.description}
                  </FAQItem>
                ))}
              </View>
            </BaseScene>
          </View>
          <View style={styles.overlay} pointerEvents="none">
            <LinearGradient
              colors={[Colours.MenuBackground, Colours.BlackTransparent]}
              start={{ y: 1, x: 0 }}
              end={{ y: 0, x: 0 }}
              style={styles.gradient}/>
          </View>
        </View>
      </Provider>
    );
  }
}

@inject(stores => ({
  deals: stores.dealStore.deals
}))
@observer
class Deals extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item: deal }) {
    return <DealCard {...deal} navigation={this.props.navigation} />;
  }

  render() {
    return (
      <FlatList
        data={this.props.deals}
        keyExtractor={product => `deal-${product.id}`}
        renderItem={this.renderItem}/>
    );
  }
}

class FAQItem extends React.Component {
  render() {
    return (
      <View style={[styles.cardContainer, styles.card, styles.alternate]}>
        <Text style={[styles.title, Styles.Alternate]}>{this.props.title}</Text>
        <Text style={[styles.text, Styles.Alternate]}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Sizes.InnerFrame
  },

  wrapper: {
    flex: 1,
    backgroundColor: Colours.MenuBackground
  },

  overlay: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  },

  gradient: {
    width: Sizes.Width,
    height: Sizes.OuterFrame * 8
  },

  cardContainer: {
    marginBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  card: {
    padding: Sizes.InnerFrame
  },

  alternate: {
    paddingRight: Sizes.OuterFrame * 2,
    marginBottom: 0,
    backgroundColor: Colours.Transparent
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
