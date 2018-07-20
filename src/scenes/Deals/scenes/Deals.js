import React from "react";
import {
  View,
  StyleSheet,
  Linking,
  Text,
  SectionList,
  FlatList,
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
import {
  Background,
  UpcomingCard,
  ActiveCard,
  MissedDeals
} from "../components";
import DealsUIStore from "../store";

// constants
const MESSENGER_URI = "https://m.me/localyyz";
const FAQ = [
  {
    title: "What's #DOTD?",
    description:
      "Deal of the Day.\n\nEveryday at 12PM (EST), we'll heavily discount a product to $30 (USD) for one hour until it sells out."
  },
  {
    title: "What did I miss?",
    description: "Check the rest out here.",
    onPress: (navigation, store) =>
      navigation.navigate("History", { dealStore: store }),
    renderContent: navigation => <MissedDeals navigation={navigation} />
  },
  {
    title: "Are there any restrictions?",
    description: "One per customer, per day, while quantities last."
  },
  {
    title: "Shipping?",
    description: "Free worldwide."
  },
  {
    title: "What's the return policy?",
    description:
      "14 days as long as the product is undamaged and unworn. No returns on intimates, swimwear, and accessories."
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
    this.renderFaqItem = this.renderFaqItem.bind(this);
    this.onPressImage = this.onPressImage.bind(this);
  }

  componentWillMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      // focused! fetch
      this.store.refresh(10);
      this.store.isFocused = true;
    });
    this.blurListener = this.props.navigation.addListener("willBlur", () => {
      // blurring, stop fetching deals
      this.store.clearTimeout();
      this.store.isFocused = false;
    });
  }

  componentDidMount() {
    this.store.fetch();
  }

  componentWillUnmount() {
    // unsubscribe to listeners
    this.focusListener && this.focusListener.remove();
    this.focusListener = null;

    this.blurListener && this.blurListener.remove();
    this.blurListener = null;
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

  renderFaqItem({ item: faq }) {
    return (
      <FAQItem {...faq} navigation={this.props.navigation}>
        {faq.renderContent && faq.renderContent(this.props.navigation)}
      </FAQItem>
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
                <FlatList
                  renderItem={this.renderFaqItem}
                  keyExtractor={(faq, i) => `faq-${i}`}
                  data={FAQ}/>
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
      <View style={styles.deals}>
        <SectionList
          sections={this.sections}
          renderItem={this.renderItem}
          keyExtractor={(deal, i) => `deal-${deal.id}-${i}`}/>
      </View>
    );
  }
}

@inject(stores => ({
  dealStore: stores.dealStore
}))
class FAQItem extends React.Component {
  get container() {
    return this.props.onPress ? TouchableOpacity : View;
  }

  render() {
    return (
      <View
        style={[
          styles.cardContainer,
          styles.card,
          styles.alternate,
          styles.faqContainer
        ]}>
        <View style={styles.faqContent}>
          <Text style={[styles.title, Styles.Alternate]}>
            {this.props.title}
          </Text>
          {this.props.children}
          {this.props.description ? (
            <this.container
              onPress={
                this.props.onPress
                && (() =>
                  this.props.onPress(
                    this.props.navigation,
                    this.props.dealStore
                  ))
              }
              style={styles.faq}>
              <View style={styles.faqContent}>
                <Text style={[styles.text, Styles.Alternate]}>
                  {this.props.description}
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
            </this.container>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

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

  deals: {
    marginHorizontal: Sizes.InnerFrame
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
    marginBottom: Sizes.InnerFrame / 4
  },

  text: {
    ...Styles.Text,
    paddingRight: Sizes.OuterFrame
  },

  faq: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  faqContent: {
    flex: 1
  },

  faqButton: {
    alignItems: "flex-end"
  }
});
