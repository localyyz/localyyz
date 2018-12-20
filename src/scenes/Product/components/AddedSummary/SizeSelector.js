import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

// constants
const DEFAULT_SIZE_APPEAR_INTERVAL = 100;

@inject(stores => ({
  associatedSizes: stores.productStore.associatedSizes,
  getVariantBySize: stores.productStore.getVariantBySize
}))
export default class SizeSelector extends React.Component {
  static propTypes = {
    onSelectSize: PropTypes.func.isRequired,
    selectedSize: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedSize: props.selectedSize
    };
  }

  onSizeSelect = size => {
    this.setState(
      {
        selectedSize: size
      },
      () => {
        this.props.onSelectSize(size);
      }
    );
  };

  renderSize = (size, i = 0) => {
    let variant = this.props.getVariantBySize(size);
    let isSelected = size === this.state.selectedSize;
    let isOutStock = variant.limits == 0;

    return variant ? (
      <Animatable.View
        key={`size-${size}-${i}`}
        animation="fadeInRight"
        duration={
          (this.props.sizeAppearInterval || DEFAULT_SIZE_APPEAR_INTERVAL) * 3
        }
        delay={
          (this.props.sizeAppearInterval || DEFAULT_SIZE_APPEAR_INTERVAL) * i
        }>
        <TouchableOpacity
          key={`size-${size}`}
          onPress={() => !isOutStock && this.onSizeSelect(size)}>
          <SloppyView>
            <View
              style={[
                styles.size,
                isSelected && styles.selected,
                isOutStock && styles.outStock
              ]}>
              <Text
                style={[
                  styles.sizeLabel,
                  variant.limits <= 0 && styles.oosLabel,
                  isSelected && styles.selectedLabel,
                  isOutStock && { textDecorationStyle: "dashed" }
                ]}>
                {`${size}`.toUpperCase()}
              </Text>
              {variant.limits <= 0 ? (
                <MaterialIcon
                  name="block"
                  color={Colours.SubduedText}
                  size={Sizes.TinyText}
                  style={styles.oosIcon}/>
              ) : null}
            </View>
          </SloppyView>
        </TouchableOpacity>
      </Animatable.View>
    ) : null;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.associatedSizes.map((size, i) => this.renderSize(size, i))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    flexWrap: "wrap",
    marginVertical: Sizes.InnerFrame / 2
  },

  size: {
    ...Styles.Horizontal,
    ...Styles.RoundedButton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.OuterFrame,
    borderWidth: 1,
    borderColor: Colours.AlternateText,
    backgroundColor: Colours.Transparent
  },

  sizeLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  selected: {
    backgroundColor: Colours.AlternateText
  },

  selectedLabel: {
    color: Colours.Text
  },

  outStock: {
    backgroundColor: Colours.Unselected
  }
});
