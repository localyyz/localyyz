import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Sizes } from "localyyz/constants";

// local
import Banner from "./Banner";
import CollectionList from "./CollectionList";
import Collection from "./Collection";
import Brands from "./Brands";

export default class BlockItem extends React.Component {
  // props
  // - block
  // - index

  constructor(props) {
    super(props);
  }

  render() {
    const { index: i, block } = this.props;

    let component;
    switch (block.type) {
      case "productList":
        component = (
          <Collection
            {...block}
            withMargin
            hideHeader
            id={i}
            fetchFrom={block.path}
            basePath={block.path}/>
        );
        break;
      case "collection":
        component = (
          <View
            style={i > 0 ? styles.blockContainer : styles.firstBlockContainer}>
            <Banner {...block} id={i} imageUri={block.imageUrl} />
            <Collection
              {...block}
              withMargin
              noMargin
              hideHeader
              fetchFrom={block.path}
              limit={block.limit ? block.limit : 4}/>
          </View>
        );
        break;
      case "collectionList":
        // nested collections.
        component = <CollectionList {...block} id={i} />;
        break;
      case "brand":
        component = (
          <Brands
            {...block}
            id={i}
            limit={12}
            type={block.brandType}
            shouldShowName={!!block.shouldShowName}/>
        );
        break;
    }

    return React.cloneElement(component, {
      key: `${block.type}-${block.id}`,
      id: block.id
    });
  }
}

const styles = StyleSheet.create({
  blockContainer: {
    marginVertical: Sizes.InnerFrame / 2
  },

  firstBlockContainer: {
    marginBottom: Sizes.InnerFrame / 2
  }
});
