import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { observer, inject } from "mobx-react/native";

import { Colours, Styles, Sizes } from "~/src/constants";
import Button, { BUTTON_PADDING } from "../components/button";

@inject((stores, props) => ({
  active: stores.onboardingStore.activeSlideKey === props.id
}))
@observer
export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active && this.props.fetchPath) {
      // NOTE/TODO: special case...
      // fetch additional data here
      this.props.store.fetchQuestionData(this.props.fetchPath).then(resp => {
        this.setState({
          data: resp.styles.map(s => ({
            ...s,
            key: this.props.id
          }))
        });
      });
    }
  }

  renderItem = ({ item }) => {
    return (
      <Button
        label={item.label}
        description={item.desc}
        imageUrl={item.imageUrl}
        backgroundColor={item.backgroundColor}
        onPress={() => this.props.store.selectOption(item)}/>
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        extraData={{ length: this.state.data.length }}
        renderItem={this.renderItem}
        keyExtractor={d => `item${d.id}`}
        contentContainerStyle={styles.slide}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: Sizes.ThickBorder,
              borderBottomWidth: Sizes.ThickBorder,
              borderColor: Colours.Foreground
            }}/>
        )}
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
