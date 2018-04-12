import React from "react";
import { Animated, View, StyleSheet, ScrollView } from "react-native";

// custom
import { Colours } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react";

// local
import List from "./List";
import ReactiveSpacer from "./ReactiveSpacer";

@inject("homeStore")
@observer
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.homeStore;
  }

  render() {
    return (
      <View style={styles.contentContainer}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.store.scrollAnimate
                }
              }
            }
          ])}
          style={styles.content}
        >
          <ReactiveSpacer store={this.store} heightProp="headerHeight" />
          <List
            withMargin
            title={"Today's Finds"}
            description={
              "Hand selected daily just for you by our team of fashionistas based on what you've viewed before"
            }
            listData={this.store.featuredProducts}
          />
          <List
            title={"Limited time offers"}
            description={
              "Watch this space for the hottest promotions and sales posted the minute they're live on Localyyz"
            }
            listData={this.store.discountedProducts}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },

  content: {
    flex: 1,
    backgroundColor: Colours.Background
  }
});
