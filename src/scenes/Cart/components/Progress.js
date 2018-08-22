import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

export default class Progress extends React.Component {
  static propTypes = {
    scenes: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    activeSceneId: PropTypes.string
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  get scenes() {
    return this.props.scenes.filter(scene => !scene.isHidden);
  }

  renderItem(data) {
    return (
      <ProgressItem
        {...this.props}
        {...data}
        {...data.item}
        numItems={this.scenes.length}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={this.scenes}
          renderItem={this.renderItem}
          keyExtractor={(e, i) => `progressItem-${e.label}-${i}`}/>
      </View>
    );
  }
}

@inject(stores => ({
  cartStore: stores.cartStore
}))
@observer
class ProgressItem extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.navigate(this.props.id);
  }

  get isStart() {
    return this.props.index <= 0;
  }

  get isEnd() {
    return this.props.index >= this.props.numItems - 1;
  }

  get isActive() {
    return (
      this.props.scenes.findIndex(
        scene => scene.id === this.props.activeSceneId
      ) >= this.props.index
    );
  }

  get containerComponent() {
    return this.isActive ? TouchableOpacity : View;
  }

  render() {
    return (
      <this.containerComponent
        testID={this.props.id}
        onPress={this.onPress}
        style={[
          itemStyles.container,
          !this.isStart && itemStyles.startSpacing,
          !this.isEnd && itemStyles.endSpacing,
          this.isActive && itemStyles.active
        ]}>
        <Text
          style={[itemStyles.label, this.isActive && itemStyles.activeLabel]}>
          {this.props.label}
        </Text>
      </this.containerComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Sizes.InnerFrame / 4,
    borderBottomColor: Colours.Text,
    borderBottomWidth: Sizes.Spacer
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  startSpacing: {
    paddingLeft: Sizes.InnerFrame / 2
  },

  endSpacing: {
    paddingRight: Sizes.InnerFrame / 2
  },

  active: {
    borderBottomWidth: 1
  },

  activeLabel: {
    ...Styles.Emphasized
  }
});
