import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Colours, Sizes } from "localyyz/constants";

// custom
import ProgressiveImage from "~/src/components/ProgressiveImage";
import Swiper from "react-native-swiper";

// third party
import PropTypes from "prop-types";

export default class ProductHeader extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    onPress: PropTypes.func
  };

  render() {
    return (
      <Swiper
        loop={false}
        showsPagination={true}
        activeDotColor={Colours.Accented}
        style={styles.container}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}>
        {this.props.images.map(image => {
          return (
            <TouchableWithoutFeedback
              key={`image${image.id}`}
              onPress={() => this.props.onPress(image.imageUrl)}>
              <ProgressiveImage
                resizeMode={
                  image.width >= image.height ? "contain" : "cover"
                }
                source={{
                  uri: image.imageUrl
                }}
                style={styles.image}/>
            </TouchableWithoutFeedback>
          );
        })}
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    maxHeight: 2 * Sizes.Height / 3
  },

  image: {
    width: Sizes.Width,
    height: 2 * Sizes.Height / 3
  }
});
