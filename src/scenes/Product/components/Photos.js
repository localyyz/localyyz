import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import { observer, inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// constants
const PAGE_SIZE = 3;

@inject(stores => ({
  // skip the first one since it's already in the cover
  photos: stores.productStore.product.associatedPhotos.slice(1)
}))
@observer
export default class Photos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visiblePhotos: props.photos.slice(0, PAGE_SIZE)
    };

    // bindings
    this.renderPhoto = this.renderPhoto.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  renderPhoto({ item: photo }) {
    return (
      <TouchableOpacity onPress={() => this.props.onPress(photo.imageUrl)}>
        <View style={styles.photo}>
          <ConstrainedAspectImage
            source={{ uri: photo.imageUrl }}
            constrainWidth={Sizes.Width}
            sourceWidth={photo.width}
            sourceHeight={photo.height}/>
        </View>
      </TouchableOpacity>
    );
  }

  loadMore(n) {
    this.setState({
      visiblePhotos: [
        ...this.state.visiblePhotos,
        ...this.props.photos.slice(
          this.state.visiblePhotos.length,
          this.state.visiblePhotos.length + (n || PAGE_SIZE)
        )
      ]
    });
  }

  get photosRemaining() {
    return this.props.photos.length - this.state.visiblePhotos.length;
  }

  render() {
    return this.props.photos.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          data={this.state.visiblePhotos}
          renderItem={this.renderPhoto}
          keyExtractor={(item, i) => `photo-${i}`}/>
        {this.photosRemaining > 0 ? (
          <TouchableOpacity onPress={() => this.loadMore()}>
            <View style={styles.more}>
              <Text style={styles.moreLabel}>
                {`Show ${this.photosRemaining} more photos`}
              </Text>
              <MaterialIcon
                name="keyboard-arrow-down"
                size={Sizes.SmallText}
                color={Colours.Text}/>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  },

  photo: {
    marginVertical: 1,
    alignItems: "center"
  },

  more: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame / 2
  },

  moreLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    marginRight: Sizes.InnerFrame / 2
  }
});
