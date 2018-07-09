import React from "react";
import {
  View,
  StyleSheet,
  Linking,
  Text,
  SectionList,
  TouchableOpacity
} from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";
import { Provider, observer, inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { BaseScene, PhotoDetails } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

// local
import { Background, UpcomingCard, ActiveCard } from "./components";
import DealsUIStore from "./store";

// constants
const MESSENGER_URI = "https://m.me/localyyz";
const FAQ = [
  {
    title: "What's #DOTD?",
    description:
      "Deal of the Day.\n\nEveryday at 12PM (EST), we'll heavily discount a product to $30 (USD) for one hour until it sells out."
  },
  {
    title: "Are there any restrictions?",
    description: "One per customer, per day, while quantities last."
  },
  {
    title: "Shipping?",
    description: "Free internationally."
  },
  {
    title: "What's the return policy?",
    description: "14 days as long as the product is undamaged and unworn."
  },
  {
    title: "Questions?",
    description: "We're here. DM us directly on Facebook Messenger.",
    onPress: () => Linking.openURL(MESSENGER_URI)
  }
];

export default class DealsScene extends React.Component {
  constructor(props) {
    super(props);
    this.photoDetailsRef = React.createRef();

    // store
    this.store = new DealsUIStore();

    // bindings
    this.renderHeader = this.renderHeader.bind(this);
    this.onPressImage = this.onPressImage.bind(this);
  }

  componentDidMount() {
    this.store.fetch();
  }

  renderHeader() {
    return <Background onComplete={this.store.fetch} />;
  }

  onPressImage(imageUrl) {
    return (
      this.photoDetailsRef
      && this.photoDetailsRef.current
      && this.photoDetailsRef.current.wrappedInstance
      && this.photoDetailsRef.current.wrappedInstance.toggle
      && this.photoDetailsRef.current.wrappedInstance.toggle(true, imageUrl)
    );
  }

  render() {
    return (
      <Provider dealStore={this.store}>
        <View style={styles.wrapper}>
          <View style={styles.overlay} pointerEvents="box-none">
            <BaseScene
              title="#DOTD"
              header={this.renderHeader()}
              idleStatusBarStatus="light-content">
              <View style={styles.container}>
                <Deals
                  onPressImage={this.onPressImage}
                  navigation={this.props.navigation}/>
                {FAQ.map((faq, i) => (
                  <FAQItem key={`faq-${i}`} {...faq}>
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
          <PhotoDetails
            ref={this.photoDetailsRef}
            navigation={this.props.navigation}/>
        </View>
      </Provider>
    );
  }
}

@inject(stores => ({
  active: stores.dealStore.active,
  upcoming: stores.dealStore.upcoming,
  now: stores.dealStore.now
}))
@observer
class Deals extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderActiveItem = this.renderActiveItem.bind(this);
  }

  renderItem({ item: deal }) {
    return (
      <UpcomingCard
        now={this.props.now}
        deal={deal}
        navigation={this.props.navigation}/>
    );
  }

  renderActiveItem({ item: deal }) {
    return (
      <ActiveCard
        now={this.props.now}
        deal={deal}
        navigation={this.props.navigation}
        onPressImage={this.props.onPressImage}/>
    );
  }

  get sections() {
    return [
      {
        data: this.props.active && this.props.active.slice(),
        renderItem: this.renderActiveItem
      },
      { data: this.props.active && this.props.upcoming.slice() }
    ];
  }

  render() {
    return (
      <SectionList
        sections={this.sections}
        renderItem={this.renderItem}
        keyExtractor={(deal, i) => `deal-${deal.id}-${i}`}/>
    );
  }
}

class FAQItem extends React.Component {
  get container() {
    return this.props.onPress ? TouchableOpacity : View;
  }

  render() {
    return (
      <this.container
        onPress={this.props.onPress}
        style={[
          styles.cardContainer,
          styles.card,
          styles.alternate,
          styles.faqContainer
        ]}>
        <View style={styles.faq}>
          <View style={styles.faqContent}>
            <Text style={[styles.title, Styles.Alternate]}>
              {this.props.title}
            </Text>
            <Text style={[styles.text, Styles.Alternate]}>
              {this.props.children}
            </Text>
          </View>
          <View style={styles.faqButton}>
            {this.props.onPress ? (
              <MaterialIcon
                name="keyboard-arrow-right"
                size={Sizes.H2}
                color={Colours.AlternateText}/>
            ) : null}
          </View>
        </View>
      </this.container>
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
  },

  faq: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  faqContent: {
    flex: 1,
    paddingRight: Sizes.OuterFrame
  },

  faqButton: {
    alignItems: "flex-end"
  }
});
