import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { observer, inject } from "mobx-react/native";

import { Colours, Styles, Sizes } from "~/src/constants";
import Button, { BUTTON_HEIGHT, BUTTON_PADDING } from "../components/button";

@inject(stores => ({
  onboardingStore: stores.onboardingStore,
  selectOption: stores.onboardingStore.selectOption,
  getSelected: key => stores.onboardingStore.selected.get(key)
}))
@observer
export default class Question extends React.Component {
  renderItem = ({ item }) => {
    const isInitiallySelected = this.props.getSelected(`${item.id}`);

    return (
      <Button
        label={item.label}
        description={item.desc}
        imageUrl={item.imageUrl}
        selected={isInitiallySelected}
        backgroundColor={item.backgroundColor}
        onPress={() => this.props.selectOption(item)}/>
    );
  };

  render() {
    // each button height is defined. figure out how many we can fit in one screen
    const slideHeight
      = Sizes.Height - (Sizes.OuterFrame + Sizes.ScreenTop + Sizes.ScreenBottom);
    const itemPerHeight = Math.floor(slideHeight / BUTTON_HEIGHT);
    // math ceil the pagination multiple
    const pageMult = Math.ceil(this.props.data.length / itemPerHeight) || 1;
    const minHeightStyle = { minHeight: Sizes.Height * pageMult };

    return (
      <SafeAreaView>
        <FlatList
          data={this.props.data.slice()}
          renderItem={this.renderItem}
          keyExtractor={d => `item${d.id}`}
          style={[styles.container, minHeightStyle]}
          contentContainerStyle={styles.slide}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colours.Tint} />
              <Text style={styles.titleText}>
                Answer the previous questions to select your style
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.title}>
              <Text style={styles.titleText}>{this.props.title}</Text>
              <Text style={styles.infoText}>{this.props.info}</Text>
            </View>
          }/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  slide: {
    marginHorizontal: BUTTON_PADDING
  },

  separator: {
    height: Sizes.ThickBorder,
    borderBottomWidth: Sizes.ThickBorder,
    borderColor: Colours.Transparent
  },

  emptyContainer: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.OuterFrame * 5,
    borderWidth: 1,
    borderStyle: "dashed"
  },

  title: {
    padding: Sizes.InnerFrame
  },

  titleText: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center",
    fontSize: Sizes.H1
  },

  infoText: {
    ...Styles.SmallText,
    ...Styles.Subdued,
    textAlign: "center"
  }
});
