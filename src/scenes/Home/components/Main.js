import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { ReactiveSpacer } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// local
import { Blocks } from "../blocks";

@inject(stores => ({
  homeStore: stores.homeStore,

  // blocks
  blocks: stores.homeStore.blocks,
  onScrollAnimate: stores.homeStore.onScrollAnimate,

  // block fetching
  fetchCollectionBlocks: () => stores.homeStore.fetchCollectionBlocks()
}))
@observer
export class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCollectionBlocks();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />

        <ReactiveSpacer
          offset={Sizes.StatusBar}
          store={this.props.homeStore}
          heightProp="headerHeight"/>

        <Blocks
          blocks={this.props.blocks}
          onScrollAnimate={this.props.onScrollAnimate}/>

        <View pointerEvents="box-none" style={styles.filter}>
          <LinearGradient
            colors={[Colours.WhiteTransparent, Colours.Transparent]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
            pointerEvents="box-none"/>
        </View>
      </View>
    );
  }
}

export default withNavigation(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  statusBar: {
    height: Sizes.StatusBar,
    backgroundColor: Colours.Foreground
  },

  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 7,
    width: Sizes.Width
  },

  filter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
});
