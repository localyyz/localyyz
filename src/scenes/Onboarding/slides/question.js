import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { observer, inject } from "mobx-react/native";

import { Colours, Styles, Sizes } from "~/src/constants";
import Button, { BUTTON_PADDING } from "../components/button";

@inject(stores => ({
  onboardingStore: stores.onboardingStore,
  selectOption: stores.onboardingStore.selectOption
}))
@observer
export default class Question extends React.Component {
  renderItem = ({ item }) => {
    return (
      <Button
        label={item.label}
        description={item.desc}
        imageUrl={item.imageUrl}
        backgroundColor={item.backgroundColor}
        onPress={() => this.props.selectOption(item)}/>
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.data.slice()}
        renderItem={this.renderItem}
        keyExtractor={d => `item${d.id}`}
        style={styles.container}
        contentContainerStyle={styles.slide}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: Sizes.ThickBorder,
              borderBottomWidth: Sizes.ThickBorder,
              borderColor: Colours.Foreground
            }}/>
        )}
        ListEmptyComponent={
          <ActivityIndicator size="large" color={Colours.Tint} />
        }
        ListHeaderComponent={
          <View style={styles.title}>
            <Text style={styles.titleText}>{this.props.title}</Text>
            <Text style={styles.infoText}>{this.props.info}</Text>
          </View>
        }/>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  slide: {
    marginHorizontal: BUTTON_PADDING,
    paddingTop: Sizes.ScreenTop + Sizes.InnerFrame * 3,
    paddingBottom: Sizes.ScreenBottom + Sizes.Height / 5
  },

  title: {
    paddingHorizontal: Sizes.InnerFrame
  },

  titleText: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center"
  },

  infoText: {
    ...Styles.SmallText,
    ...Styles.Subdued,
    textAlign: "center",
    paddingVertical: Sizes.InnerFrame
  }
});
