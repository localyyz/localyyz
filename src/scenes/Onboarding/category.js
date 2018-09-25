import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet
} from "react-native";
import { observer, inject } from "mobx-react/native";

import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "~/src/constants";
import { Button, BUTTON_PADDING } from "./components";
import { PickMinCount } from "./store";

@observer
class Topic extends React.Component {
  render() {
    return (
      <Button
        {...this.props.item}
        selected={this.props.selected}
        onPress={this.props.onPress}/>
    );
  }
}

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.onboardingStore;
  }

  renderItem = (item, index) => {
    return (
      <Topic
        key={item.id}
        item={item}
        selected={this.store.selected.has(item.id)}
        onPress={() => this.store.fetchCategory(item, index)}/>
    );
  };

  renderHeader = () => {
    const selectCalloutText
      = this.store.selectedCount == 0
        ? `Choose at least ${PickMinCount}. It'll help us curate the app for you.`
        : this.store.selectedCount < PickMinCount
          ? `Pick ${PickMinCount - this.store.selectedCount} more`
          : "Select more to further refine your topics.";

    return (
      <View style={styles.header}>
        <Text style={styles.h1}>Pick some topics you like.</Text>
        <Text style={styles.subtitle}>{selectCalloutText}</Text>
      </View>
    );
  };

  onNext = () => {
    this.props.navigation.navigate("PickMerchant");
  };

  renderNextButton = () => {
    return this.store.selectedCount >= PickMinCount ? (
      <TouchableWithoutFeedback onPress={this.onNext}>
        <View style={Styles.RoundedButton}>
          <Text style={Styles.RoundedButtonText}>Next</Text>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <View style={Styles.RoundedButton}>
        <Text style={Styles.RoundedButtonText}>
          Select {PickMinCount - this.store.selectedCount} More
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={16}
          initialNumToRender={8}
          numColumns={2}>
          <View style={styles.list}>
            {this.renderHeader()}
            {this.store.categories
              .slice()
              .map((item, index) => this.renderItem(item, index))}
          </View>
        </ScrollView>
        <View pointerEvents="box-none" style={styles.footer}>
          {this.renderNextButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.ScreenTop,
    paddingHorizontal: BUTTON_PADDING,
    backgroundColor: Colours.Foreground
  },

  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  header: {
    paddingBottom: Sizes.InnerFrame
  },

  h1: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    ...Styles.Title,
    paddingBottom: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text,
    fontSize: Sizes.SmallText
  },

  footer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Sizes.ScreenBottom + Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
