import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { LiquidImage } from "localyyz/components";

// third party
import { inject, observer, PropTypes as mobxPropTypes } from "mobx-react";
import PropTypes from "prop-types";
import Carousel from "react-native-snap-carousel";

@inject(stores => ({
  images: stores.productStore.product.images,
  selectedVariant: stores.productStore.selectedVariant
}))
@observer
export default class ImageCarousel extends React.Component {
  static propTypes = {
    images: mobxPropTypes.arrayOrObservableArray,
    selectedVariant: mobxPropTypes.objectOrObservableObject,
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { activePhoto: 0 };

    // carousel ref
    this.carouselRef = React.createRef();

    // sort image and initialize an image map for lookup
    this.images
      = props.images && props.images.length > 0
        ? props.images
            .slice()
            .sort((a, b) => (a.ordering > b.ordering ? 1 : -1))
            .map((image, i) => ({ ...image, position: i }))
        : [];

    this.imageMap = this.images.reduce((acc, image) => {
      if (image.id) {
        acc[image.id] = image;
      }
      return acc;
    }, {});
  }

  componentDidMount() {
    // FUCK
    // https://github.com/archriss/react-native-snap-carousel/issues/238
    this.timer = setTimeout(() => {
      this.carouselRef.current
        && this.carouselRef.current.triggerRenderingHack();
    }, 10);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.images.length !== this.props.images.length
      || nextState.activePhoto !== this.state.activePhoto
    ) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedVariant && nextProps.selectedVariant.imageId) {
      this.showImage(nextProps.selectedVariant.imageId);
    }
  }

  showImage = id => {
    let position = this.imageMap[id];
    position
      && this.carouselRef.current
      && this.carouselRef.current.snapToItem(position.position, true);
  };

  renderItem = item => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onPress(item.item.imageUrl);
        }}>
        <LiquidImage
          caller="product"
          w={Sizes.Width - Sizes.InnerFrame * 2}
          h={Sizes.Height / 2}
          style={styles.photo}
          source={{
            uri: item.item.imageUrl
          }}/>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return this.images && this.images.length > 0 ? (
      <View style={styles.carouselContainer}>
        <Carousel
          ref={this.carouselRef}
          data={this.images}
          renderItem={this.renderItem}
          collapsable={false}
          onSnapToItem={i => {
            this.setState({
              activePhoto: i
            });
          }}
          sliderWidth={Sizes.Width}
          itemWidth={Sizes.Width - Sizes.InnerFrame * 2}/>
        <View style={styles.pagination}>
          <Text style={styles.paginationLabel}>
            {`${this.state.activePhoto + 1}/${this.images.length}`}
          </Text>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
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

  photo: {
    backgroundColor: Colours.Foreground
  }
});
