import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  WebView,
  Alert,
  TouchableWithoutFeedback,
  Linking
} from "react-native";

// custom
import Store from "./store";
import { randInt } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Product } from "localyyz/models";
import {
  ContentCoverSlider,
  UppercasedText,
  PhotoDetails,
  StaggeredList,
  ProductTile,
  LiquidImage,
  DiscountBadge,
  VerifiedBadge,
  ConstrainedAspectImage,
  MoreTile
} from "localyyz/components";
import { NAVBAR_HEIGHT } from "../../components/NavBar";
import { MAX_TITLE_WORD_LENGTH } from "../../models/Product";

// third party
import { inject, observer, Provider } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";

// local component
import {
  ImageCarousel,
  ProductBuy,
  ProductVariantSelector,
  SizeChart
} from "./components";

// consts
const BADGE_MIN_DISCOUNT = 0.1;

@inject("navStore", "cartStore", "userStore", "assistantStore", "historyStore")
@observer
class ProductScene extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { state: { params } } = navigation;
    const { product } = params;

    return {
      ...navigationOptions,
      headerTitle: product && product.etc.brand
    };
  };

  constructor(props) {
    super(props);

    if (
      props.navigation.state.params.product
      && typeof props.navigation.state.params.product != "Product"
    ) {
      props.navigation.state.params.product = new Product(
        props.navigation.state.params.product
      );
    }

    this.store = new Store(props.navigation.state.params);
    this.history = this.props.historyStore;
    this.assistant = this.props.assistantStore;
    this.cart = this.props.cartStore;
    this.state = {
      isDoneAdd: false,
      activePhoto: 0,
      backgroundPosition: 0
    };

    // bindings
    this.onAdd = this.onAdd.bind(this);
    this.onExpress = this.onExpress.bind(this);
    this.onAddedSummaryDismiss = this.onAddedSummaryDismiss.bind(this);
    this.fetchDeepLinkedProduct = this.fetchDeepLinkedProduct.bind(this);
    this.onVariantChange = this.onVariantChange.bind(this);
  }

  componentDidMount() {
    if (this.store.product) {
      // fetch related products if product is already available
      this.store.fetchRelatedProduct();
    } else {
      // set is deeplinked
      this.store.isDeepLinked = true;
      // fetch deep link product
      this.fetchDeepLinkedProduct();
    }

    // set app context
    this.props.navStore.setAppContext("product");

    // internal history logging
    this.store.product && this.history.log(this.store.product);
  }

  get productId() {
    return this.store.product
      ? this.store.product.id
      : this.props.navigation.state.params.productId;
  }

  componentWillUnmount() {
    // set app context to help app resume the correct state
    // please see "Deeplink" for comments and why this is needed
    this.props.navStore.setAppContext();
  }

  fetchDeepLinkedProduct(next) {
    const { navigation: { state } } = next || this.props;
    state.params
      && this.store
        .fetchProduct(state.params.productId, true)
        .then(
          () => !this.store.relatedProducts && this.store.fetchRelatedProduct()
        );
  }

  onExpress() {
    // block user progress until express is ready
    let message = "Hold on, I'm preparing your express checkout..";
    this.assistant.write(message, 10000, true);

    // clear the previous express cart,
    // then add to the express cart
    this.cart
      .destroy({ cartId: "express" })
      .then(() =>
        this.cart.addItem({
          cartId: "express",
          productId: this.store.product.id,
          color: this.store.selectedVariant.etc.color,
          size: this.store.selectedVariant.etc.size
        })
      )
      .then(() => {
        // launch apple pay modal
        const _onCheckoutFailure = response => {
          // close assistant
          this.assistant.get(message).cancel();
          if (response._paymentResponse) {
            // debugging
            response._error && console.log(response._error);

            // TODO: use custom UI rather than Alert
            if (response._error.message !== "AbortError") {
              // dismiss apple pay ui
              response._paymentResponse._paymentRequest.abort();

              Alert.alert(
                response._failureTitle || "Payment Failed",
                response._failureMessage
                  || "We couldn't complete your purchase at this time",
                [{ text: "OK" }]
              );
            }

            // revert the cart back to normal
            this.cart.fetch();
          }
        };

        // fetch express cart
        this.cart
          .fetch({ cartId: "express" })
          .then(this.cart.launchExpressPayment)
          .then(response => {
            // close assistant
            this.assistant.get(message).cancel();
            return response;
          })
          .then(this.cart.onUserAcceptPayment)
          .then(this.cart.payExpressCheckout)
          .then(response => {
            // move user to completion summary
            if (!response._wasFailed) {
              response._paymentResponse.complete("success");

              // show cart summary, refetch to get shippingAddress
              this.cart
                .replace(response)
                .then(() =>
                  this.props.navigation.navigate("CartSummary", {
                    wasSuccessful: true,
                    cart: this.cart.cart,
                    customerName: this.cart.customerName,
                    shippingDetails: this.cart.shippingDetails,
                    shippingExpectation: this.cart.shippingExpectation,
                    amountSubtotal: this.cart.amountSubtotal,
                    amountTaxes: this.cart.amountTaxes,
                    amountDiscount: this.cart.amountDiscount,
                    amountTotal: this.cart.amountTotal,
                    amountShipping: this.cart.amountShipping

                    // revert the cart back to normal
                  })
                )
                .then(() => this.cart.fetch())
                .catch(e => console.log(e));
            } else {
              // failed
              _onCheckoutFailure(response);
            }
          })
          .catch(_onCheckoutFailure);
      });
  }

  onAdd() {
    // display the added cart summary modal
    this.setState({ productAdded: true }, () => {
      // add item to cart and hide the navbar
      // TODO: error handling
      this.cart.hide();
      this.cart.addItem({
        productId: this.store.product.id,
        color: this.store.selectedVariant.etc.color,
        size: this.store.selectedVariant.etc.size
      });
    });
  }

  onAddedSummaryDismiss(callback) {
    this.setState({
      productAdded: false
    });

    // reset exploder and reshow navbar
    this.productBuyRef.wrappedInstance.reset();
    this.cart.show();

    // callback
    callback && callback();
  }

  get images() {
    return this.store.product.images && this.store.product.images.length > 0
      ? [...this.store.product.images]
          .sort((a, b) => (a.ordering > b.ordering ? 1 : -1))
          .map((image, i) => ({ ...image, position: i }))
      : null;
  }

  get imageMap() {
    return this.images.reduce((acc, image) => {
      if (image.id) {
        acc[image.id] = image;
      }

      return acc;
    }, {});
  }

  onVariantChange(variant) {
    this.store.onSelectVariant(variant);
  }

  get renderExpandedDescription() {
    return (
      <View style={styles.expandedDescription}>
        <WebView
          javaScriptEnabled
          automaticallyAdjustContentInsets
          scrollEnabled
          source={{
            html: `
              <html><head>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                  }

                  h1, h2, h3, h4, h5, h6, #content, strong, p, li {
                    font-family: "San Francisco Text" !important;
                    font-size: ${Sizes.SmallText} !important;
                    font-weight: ${Sizes.Normal};
                  }

                  h1, h2, h3, h4, h5, h6 {
                    font-weight: ${Sizes.Medium} !important;
                  }

                  #content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    padding: 0;
                  }
                </style>
              </head><body>
                <div id="content">
                  ${this.store.product.htmlDescription.replace(
                    /<img[^>]*>/g,
                    ""
                  )}
                </div>
              </body></html>
            `
          }}/>
      </View>
    );
  }

  get renderAddedSummary() {
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        duration={300}
        style={styles.summaryContainer}>
        <View style={styles.summary}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.summaryContent}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitleLabel}>Added to cart</Text>
              <Animatable.View animation="bounceIn" delay={900}>
                <Icon
                  color={Colours.Success}
                  size={Sizes.IconButton}
                  name="check-circle"/>
              </Animatable.View>
            </View>
            <View style={[Styles.Card, styles.card, styles.summaryItem]}>
              <View>
                {this.images.length > 0 ? (
                  <LiquidImage
                    square
                    resizeMode="cover"
                    crop="bottom"
                    w={Sizes.SquareButton}
                    style={styles.summaryPhoto}
                    source={{
                      uri: this.images[0].imageUrl
                    }}/>
                ) : (
                  <View style={styles.summaryPhoto} />
                )}
              </View>
              <View style={styles.summaryItemDescription}>
                <Text style={styles.summaryItemAddedTitle}>
                  {this.store.product.truncatedTitle}
                </Text>
                <Text style={styles.summaryItemDetails}>
                  {`${
                    this.store.selectedVariant.etc.size
                      ? this.store.selectedVariant.etc.size + " - "
                      : ""
                  }${
                    this.store.selectedVariant.etc.color
                      ? this.store.selectedVariant.etc.color + " - "
                      : ""
                  }$${this.store.selectedVariant.price} ${
                    this.store.product.place.currency
                  }`}
                </Text>
              </View>
            </View>
            {this.store.relatedProducts
            && this.store.relatedProducts.length > 0 ? (
              <View
                style={[
                  styles.card,
                  Styles.EqualColumns,
                  styles.summaryHeader,
                  Styles.TopSpacing
                ]}>
                <Text
                  style={[
                    Styles.Text,
                    Styles.Emphasized,
                    Styles.SectionTitle,
                    Styles.Alternate
                  ]}>
                  Check these out too
                </Text>
                <Animatable.View animation="bounceIn" delay={800}>
                  <TouchableOpacity
                    onPress={() => {
                      this.onAddedSummaryDismiss();
                      this.props.navigation.navigate("ProductList", {
                        fetchPath: `/places/${
                          this.store.product.place.id
                        }/products`,
                        title: this.store.product.place.name
                      });
                    }}>
                    <Text
                      style={[
                        Styles.Text,
                        Styles.Emphasized,
                        Styles.Terminal,
                        Styles.Alternate,
                        styles.moreButton
                      ]}>
                      view more
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            ) : null}
            <View style={styles.summaryRelatedContainer}>
              {this.store.relatedProducts
                && this.store.relatedProducts.length > 0
                && this.store.relatedProducts.map(product => (
                  <TouchableOpacity
                    key={`summary-related-${product.id}`}
                    onPress={() => {
                      this.onAddedSummaryDismiss();
                      this.props.navigation.navigate("Product", {
                        product: product
                      });
                    }}>
                    <Animatable.View
                      animation="fadeInRight"
                      delay={randInt(400) + 400}
                      duration={300}
                      style={[
                        Styles.Card,
                        styles.card,
                        styles.summaryItem,
                        styles.summaryRelatedItem
                      ]}>
                      {product.images && product.images.length > 0 ? (
                        <LiquidImage
                          square
                          w={Sizes.SquareButton * 2 / 3}
                          resizeMode="contain"
                          crop="bottom"
                          style={styles.summaryRelatedPhoto}
                          source={{
                            uri: product.images[0].imageUrl
                          }}/>
                      ) : (
                        <View style={styles.summaryRelatedPhoto} />
                      )}
                      <View style={styles.summaryItemDescription}>
                        <Text style={styles.summaryRelatedTitle}>
                          {product.truncatedTitle}
                        </Text>
                        <View style={Styles.Horizontal}>
                          <Text
                            style={[
                              Styles.Text,
                              Styles.Terminal,
                              Styles.Alternate,
                              Styles.SmallText
                            ]}>
                            {`$${product.variants[0].price.toFixed(2)} ${
                              product.place.currency
                            }`}
                          </Text>
                          {product.variants[0].prevPrice
                          && product.variants[0].prevPrice > 0 ? (
                            <Text
                              style={[
                                Styles.Text,
                                Styles.Terminal,
                                styles.prevPrice,
                                Styles.SmallText
                              ]}>
                              {product.variants[0].prevPrice.toFixed(2)}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </Animatable.View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
          <LinearGradient
            colors={[Colours.BlackTransparent, Colours.DarkTransparent]}
            style={styles.summaryGradient}/>
          <View style={[Styles.Card, styles.card, styles.cartButtons]}>
            <TouchableOpacity
              onPress={() =>
                this.onAddedSummaryDismiss(() => this.cart.toggle(true))
              }>
              <View style={Styles.RoundedButton}>
                <UppercasedText style={styles.addButtonLabel}>
                  View your cart
                </UppercasedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onAddedSummaryDismiss()}
              style={styles.dismissButton}>
              <EntypoIcon
                color={Colours.AlternateText}
                size={Sizes.Oversized}
                name="chevron-with-circle-down"/>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  }

  get renderShippingPolicy() {
    return this.store.product && this.store.product.shippingPolicy ? (
      <TouchableOpacity
        onPress={() =>
          this.store.product.shippingPolicy.url
          && Linking.openURL(this.store.product.shippingPolicy.url)
        }>
        <View style={styles.detailsSection}>
          <View style={styles.detailsSectionHeader}>
            <Text style={styles.detailsSectionTitle}>Shipping</Text>
            {this.store.product.shippingPolicy.url ? (
              <MaterialIcon name="expand-more" size={Sizes.Text} />
            ) : null}
          </View>
          <Text style={styles.detailsSectionContent}>
            {this.store.product.shippingPolicy.desc}
          </Text>
        </View>
      </TouchableOpacity>
    ) : null;
  }

  get renderReturnPolicy() {
    return this.store.product && this.store.product.returnPolicy ? (
      <TouchableOpacity
        onPress={() =>
          this.store.product.returnPolicy.url
          && Linking.openURL(this.store.product.returnPolicy.url)
        }>
        <View style={styles.detailsSection}>
          <View style={styles.detailsSectionHeader}>
            <Text style={styles.detailsSectionTitle}>Return policy</Text>
            {this.store.product.returnPolicy.url ? (
              <MaterialIcon name="expand-more" size={Sizes.Text} />
            ) : null}
          </View>
          <Text style={styles.detailsSectionContent}>
            {this.store.product.returnPolicy.desc}
          </Text>
        </View>
      </TouchableOpacity>
    ) : null;
  }

  get renderSocial() {
    return this.store.product && this.store.product.isSocial ? (
      <View style={styles.detailsMerchantInformationSocial}>
        {this.store.product.place.facebookUrl.length > 0 ? (
          <EntypoIcon
            name="facebook-with-circle"
            color={Colours.Secondary}
            size={Sizes.IconButton}
            onPress={() =>
              Linking.openURL(this.store.product.place.facebookUrl)
            }
            style={styles.detailsMerchantInformationSocialIcon}/>
        ) : null}
        {this.store.product.place.instagramUrl.length > 0 ? (
          <EntypoIcon
            name="instagram-with-circle"
            color={Colours.Primary}
            size={Sizes.IconButton}
            onPress={() =>
              Linking.openURL(this.store.product.place.instagramUrl)
            }
            style={Styles.detailsMerchantInformationSocialIcon}/>
        ) : null}
      </View>
    ) : null;
  }

  get renderUsedIndicator() {
    return this.store.product && this.store.product.isUsed ? (
      <View style={styles.detailsSection}>
        <View style={styles.detailsAlert}>
          <Text style={Styles.Text}>
            <Text style={Styles.Emphasized}>
              This is a previously loved item
            </Text>{" "}
            and may exhibit minor cosmetic blemishes from normal use.
          </Text>
          <Text style={styles.detailsSectionContent}>
            Please carefully review the item description, photos, and merchant
            return policy prior to purchase.
          </Text>
        </View>
      </View>
    ) : null;
  }

  render() {
    return this.store.product ? (
      <Provider productStore={this.store}>
        <View style={styles.productView}>
          <ContentCoverSlider
            ref="container"
            title={this.store.product.truncatedTitle}
            backAction={() => {
              this.props.navigation.goBack();
              this.props.navigation.state.params.onBack
                && this.props.navigation.state.params.onBack();
            }}
            fadeHeight={this.state.backgroundPosition * 2 / 3}
            background={
              <View
                onLayout={e =>
                  this.setState({
                    // pushes content under the end of background dynamically
                    backgroundPosition:
                      e.nativeEvent.layout.y + e.nativeEvent.layout.height
                  })
                }
                style={styles.headerContainer}>
                <View style={styles.badges}>
                  {this.store.product.discount >= BADGE_MIN_DISCOUNT && (
                    <View style={styles.badge}>
                      <DiscountBadge product={this.store.product} />
                    </View>
                  )}
                  {this.store.product
                    && this.store.product.place
                    && this.store.product.place.weight > 5 && (
                      <View style={styles.badge}>
                        <VerifiedBadge />
                      </View>
                    )}
                </View>
                <Text
                  style={[
                    styles.headerTitle,
                    this.store.product.numTitleWords > MAX_TITLE_WORD_LENGTH
                      ? Styles.Title
                      : Styles.Oversized
                  ]}>
                  {this.store.product.title}
                </Text>
                {this.store.product.place ? (
                  <Text style={styles.headerSubtitle}>
                    {this.store.product.place.name}
                  </Text>
                ) : null}
              </View>
            }
            backColor={Colours.Text}>
            <ScrollView
              contentContainerStyle={styles.productContainer}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              onScroll={event => this.refs.container.onScroll(event)}>
              <LinearGradient
                colors={[Colours.Transparent, Colours.Background]}
                style={[
                  styles.optionsContainer,
                  {
                    marginTop: this.state.backgroundPosition
                  }
                ]}>
                <ProductVariantSelector
                  product={this.store.product}
                  onSelect={this.onVariantChange}/>
                <ProductBuy
                  ref={ref => (this.productBuyRef = ref)}
                  navigation={this.props.navigation}
                  product={this.store.product}
                  variant={this.store.selectedVariant}
                  onExpressCheckout={this.onExpress}
                  onAddtoCart={this.onAdd}/>
              </LinearGradient>
              <ImageCarousel
                onPress={imageUrl => {
                  this.refs.photoDetails.toggle(true, imageUrl);
                }}/>
              <View style={[styles.card, styles.headerCard]}>
                <Text
                  style={[Styles.Text, Styles.Emphasized, Styles.SectionTitle]}>
                  Details
                </Text>
              </View>
              <View style={[Styles.Card, styles.card]}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Information", {
                      title: "Product information",
                      content: this.renderExpandedDescription
                    })
                  }>
                  <View style={styles.detailsSection}>
                    <View style={styles.detailsSectionHeader}>
                      <Text style={styles.detailsSectionTitle}>Product</Text>
                      <MaterialIcon name="expand-more" size={Sizes.Text} />
                    </View>
                    <Text style={styles.detailsSectionContent}>
                      {this.store.product.truncatedDescription}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.store.product.isSizeChartSupported
                    && this.props.navigation.navigate("Information", {
                      title: "Sizing and fit",
                      content: (
                        <SizeChart type={this.store.product.category.value} />
                      )
                    })
                  }>
                  <View style={styles.detailsSection}>
                    <View style={styles.detailsSectionHeader}>
                      <Text style={styles.detailsSectionTitle}>
                        Sizing and fit
                      </Text>
                      {this.store.product.isSizeChartSupported ? (
                        <MaterialIcon name="expand-more" size={Sizes.Text} />
                      ) : null}
                    </View>
                    <Text style={styles.detailsSectionContent}>
                      Fits true to size
                    </Text>
                  </View>
                </TouchableOpacity>
                {this.renderUsedIndicator}
              </View>
              <View style={[Styles.Card, styles.card]}>
                <View style={styles.detailsSection}>
                  <View style={styles.detailsSectionHeader}>
                    <Text style={styles.detailsSectionTitle}>
                      About the merchant
                    </Text>
                  </View>
                </View>
                <View style={styles.detailsMerchantBanner}>
                  <View style={styles.detailsMerchantInformation}>
                    <Text style={styles.detailsMerchantInformationTitle}>
                      {this.store.product.place.name}
                    </Text>
                    {this.renderSocial}
                  </View>
                  {this.store.product
                  && this.store.product.place
                  && this.store.product.place.imageUrl ? (
                    <ConstrainedAspectImage
                      constrainHeight={Sizes.Width / 8}
                      constrainWidth={Sizes.Width / 3}
                      source={{ uri: this.store.product.place.imageUrl }}/>
                  ) : (
                    <View />
                  )}
                </View>
                {this.renderShippingPolicy}
                {this.renderReturnPolicy}
              </View>
              {this.store.relatedProducts
              && this.store.relatedProducts.length > 0 ? (
                <View style={[styles.card, styles.headerCard]}>
                  <Text
                    style={[
                      Styles.Text,
                      Styles.Emphasized,
                      Styles.SectionTitle
                    ]}>
                    Related products
                  </Text>
                </View>
              ) : null}
              {this.store.relatedProducts
              && this.store.relatedProducts.length > 0 ? (
                <View>
                  <StaggeredList offset={0} style={styles.related}>
                    {this.store.relatedProducts
                      && this.store.relatedProducts.length > 0
                      && this.store.relatedProducts.map(product => (
                        <ProductTile
                          key={`related-${product.id}`}
                          onPress={() =>
                            this.props.navigation.navigate("Product", {
                              product: product
                            })
                          }
                          product={product}/>
                      ))}
                  </StaggeredList>
                  <View style={styles.listFooter}>
                    <MoreTile
                      onPress={() =>
                        this.props.navigation.navigate("ProductList", {
                          fetchPath: `places/${
                            this.store.product.place.id
                          }/products`,
                          title: `${this.store.product.place.name}`,
                          subtitle:
                            "Here's some related products from this merchant"
                        })
                      }/>
                  </View>
                </View>
              ) : null}
            </ScrollView>
          </ContentCoverSlider>
          {this.state.productAdded && this.renderAddedSummary}
          <PhotoDetails
            ref="photoDetails"
            navigation={this.props.navigation}
            cartStore={this.props.cartStore}/>
        </View>
      </Provider>
    ) : null;
  }
}

const styles = StyleSheet.create({
  productView: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  productContainer: {
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  // content area
  card: {
    marginVertical: Sizes.InnerFrame / 8
  },

  headerContainer: {
    marginTop: Sizes.Height / 8,
    marginHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  headerCard: {
    backgroundColor: Colours.Transparent,
    marginVertical: Sizes.InnerFrame / 2,
    paddingTop: Sizes.InnerFrame
  },

  headerTitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.BottomHalfSpacing
  },

  headerSubtitle: {
    ...Styles.Text
  },

  // photo carousel
  carouselContainer: {
    height: Sizes.Height / 2,
    width: Sizes.Width,
    backgroundColor: Colours.Transparent
  },

  pagination: {
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "flex-end",
    marginVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.OuterFrame + Sizes.InnerFrame
  },

  paginationLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  // on cart add summary
  summaryContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  summary: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: Sizes.OuterFrame * 2,
    backgroundColor: Colours.StatusBar
  },

  summaryGradient: {
    height: Sizes.InnerFrame * 2,
    marginTop: -Sizes.InnerFrame * 2
  },

  summaryTitleLabel: {
    ...Styles.Text,
    ...Styles.Alternate,
    ...Styles.SectionTitle
  },

  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: Sizes.InnerFrame
  },

  summaryRelatedContainer: {
    ...Styles.Card,
    paddingVertical: 0,
    marginVertical: 0,
    backgroundColor: Colours.Transparent
  },

  summaryRelatedItem: {
    backgroundColor: Colours.Transparent,
    paddingVertical: Sizes.InnerFrame / 2,
    marginHorizontal: null,
    margin: 0,
    padding: 0
  },

  summaryItemDescription: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  },

  summaryPhoto: {
    backgroundColor: Colours.MenuBackground
  },

  summaryRelatedPhoto: {
    backgroundColor: Colours.Foreground
  },

  summaryRelatedTitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    fontSize: Sizes.H3,
    marginBottom: Sizes.InnerFrame / 2
  },

  summaryHeader: {
    ...Styles.EqualColumns,
    alignItems: "center",
    marginRight: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 2,
    paddingTop: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Transparent
  },

  summaryItemAddedTitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.BottomHalfSpacing,
    fontSize: Sizes.H3
  },

  summaryItemDetails: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.SmallText
  },

  moreButton: {
    textDecorationLine: "underline",
    marginRight: Sizes.InnerFrame / 2
  },

  // cart buttons (on add screen)
  cartButtons: {
    marginBottom: 0,
    paddingBottom: 0,
    backgroundColor: Colours.Transparent,
    alignItems: "center"
  },

  dismissButton: {
    marginTop: Sizes.InnerFrame
  },

  // options
  optionsContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame
  },

  prevPrice: {
    ...Styles.Subdued,
    fontWeight: Styles.Light,
    textDecorationLine: "line-through",
    marginLeft: Sizes.InnerFrame / 2
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  related: {
    ...Styles.Card,
    paddingHorizontal: Sizes.InnerFrame
  },

  photo: {
    backgroundColor: Colours.Foreground
  },

  detailsSection: {
    marginVertical: Sizes.InnerFrame / 2
  },

  detailsSectionTitle: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  detailsSectionContent: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  },

  detailsSectionHeader: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  detailsAlert: {
    backgroundColor: Colours.Alert,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  },

  badges: {
    ...Styles.Horizontal,
    alignItems: "center",
    marginVertical: Sizes.InnerFrame / 2
  },

  badge: {
    marginRight: Sizes.InnerFrame / 4
  },

  detailsMerchantBanner: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginVertical: Sizes.InnerFrame / 2
  },

  detailsMerchantInformation: {
    flex: 1
  },

  detailsMerchantInformationTitle: {
    ...Styles.Text,
    ...Styles.Title,
    flexWrap: "wrap",
    marginBottom: Sizes.InnerFrame
  },

  detailsMerchantInformationSocial: {
    ...Styles.Horizontal
  },

  detailsMerchantInformationSocialIcon: {
    marginRight: Sizes.InnerFrame / 2
  },

  expandedDescription: {
    flex: 1,
    height: Sizes.Height
  },

  listFooter: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame
  }
});

export default ProductScene;
