import React from "react";
import { Animated, View, StyleSheet, ScrollView } from "react-native";

// custom
import { NAVBAR_HEIGHT, Colours } from "localyyz/constants";
import { ReactiveSpacer } from "localyyz/components";

// third party
import { observer, inject } from "mobx-react";

// local
import List from "./List";

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
          showVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.store.scrollAnimate
                }
              }
            }
          ])}>
          <View style={styles.content}>
            <ReactiveSpacer store={this.store} heightProp="headerHeight" />
            <List
              withMargin
              title="Today's Finds"
              description={
                "Hand selected daily just for you by our team of fashionistas based on what you've viewed before"
              }
              fetchPath="products/featured"
              listData={this.store.featuredProducts}
              backgroundColor={Colours.Foreground}/>
            <List
              title="Limited time offers"
              description={
                "Watch this space for the hottest promotions and sales posted the minute they're live on Localyyz"
              }
              fetchPath="products/onsale"
              listData={this.store.discountedProducts}
              backgroundColor={Colours.Background}/>
          </View>
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
    backgroundColor: Colours.Background,
    paddingBottom: NAVBAR_HEIGHT
  }
});
