import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

@inject(stores => ({
  isReady:
    stores && stores.cartUiStore ? stores.cartUiStore.nextSceneIsReady : true
}))
@observer
export default class Button extends React.Component {
  get containerComponent() {
    return this.props.onPress && this.props.isReady ? TouchableOpacity : View;
  }

  get ready() {
    return (
      <View style={styles.content}>
        {this.props.icon ? (
          <FontAwesomeIcon
            name={this.props.icon}
            size={Sizes.Text}
            color={Colours.AlternateText}
            style={styles.icon}/>
        ) : null}
        <Text style={styles.label}>{this.props.children}</Text>
      </View>
    );
  }

  get loading() {
    return (
      <View style={styles.content}>
        <ActivityIndicator size="small" color={Colours.AlternateText} />
      </View>
    );
  }

  render() {
    return (
      <this.containerComponent onPress={this.props.onPress}>
        <Animatable.View
          animation="fadeIn"
          duration={500}
          style={[
            styles.container,
            this.props.backgroundColour && {
              backgroundColor: this.props.backgroundColour
            },
            this.props.style
          ]}>
          {this.props.isReady ? this.ready : this.loading}
        </Animatable.View>
      </this.containerComponent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.RoundedButton,
    backgroundColor: Colours.MenuBackground
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  icon: {
    marginRight: Sizes.InnerFrame / 2
  },

  content: {
    ...Styles.Horizontal
  }
});
