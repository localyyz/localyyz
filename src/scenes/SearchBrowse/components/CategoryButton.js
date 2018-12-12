import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";
import ProgressiveImage from "~/src/components/ProgressiveImage";
import { withNavigation } from "react-navigation";
import { capitalize } from "~/src/helpers";

// constants
export const BUTTON_PADDING = 5;
const WIDTH = Sizes.Width - 2 * BUTTON_PADDING;
const HEIGHT = Sizes.Height / 6;

const CATEGORY_MIN = 5;

export class CategoryButton extends React.Component {
  onPress = () => {
    // depending on if we have more nested categories
    // or not. navigate to product list

    // is the next category less than min category?
    // if so. flatten subcategories
    // -> this is to fix the problem with backend that has
    // extra layer of deepness involved
    //
    // for example:
    //  apparel -> dress -> day dress -> maxi dress
    //
    //  frontend should combine (day + maxi dress) into one UI
    let values = this.props.category.values || [];
    if (values && values.length < CATEGORY_MIN) {
      // flatten 1 level down
      values = values.reduce((acc, val) => {
        // remove value from parent so we don't iterate again on select
        return acc.concat([{ ...val, values: [] }, ...val.values]);
      }, []);

      values.push({
        value: `${this.props.category.value}-sale`,
        label: `${this.props.category.title} Sale`
      });
    }

    if (values.length >= CATEGORY_MIN) {
      this.props.navigation.navigate({
        routeName: "Category",
        key: `category${this.props.category.value}`,
        params: {
          title: capitalize(this.props.category.title),
          category: {
            ...this.props.category,
            values: values
          },
        }
      });
    } else {
      this.toProductList();
    }
  };

  toProductList = () => {
    this.props.navigation.navigate({
      routeName: "ProductList",
      key: `categoryProduct-${this.props.category.id}`,
      params: {
        fetchPath: `categories/${this.props.category.id}/products`,
        title: capitalize(this.props.category.title),
        hideCategoryBar: true,
        usePreferredGender: false
      }
    });
  };

  render() {
    const { toProductList, imageUrl, title } = this.props.category;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={toProductList ? this.toProductList : this.onPress}>
        <View style={styles.container}>
          <ProgressiveImage
            resizeMode={"contain"}
            source={{ uri: imageUrl }}
            style={styles.photo}/>
          <View style={styles.labelContainer}>
            <Text style={styles.label} numberOfLines={2}>
              {title.toUpperCase()}
            </Text>
            <Text style={styles.subtitle}>View Collection</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(CategoryButton);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colours.Background,
    width: WIDTH,
    height: HEIGHT
  },

  photo: {
    width: WIDTH / 3,
    height: HEIGHT,
    overflow: "hidden"
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    color: Colours.LabelGrey
  },

  subtitle: {
    ...Styles.Subtitle,
    ...Styles.SmallText
  },

  labelContainer: {
    width: 2 * WIDTH / 3,
    justifyContent: "center",
    paddingLeft: WIDTH / 6,
    paddingRight: Sizes.InnerFrame
  }
});
