import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";
import Filter, { ProductCount } from "../Filter";
import PropTypes from "prop-types";

// third party
import { observer, Provider } from "mobx-react/native";

@observer
export default class FilterPopup extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,

    // parent specifies the content style
    contentStyle: PropTypes.any,
    onClose: PropTypes.func
  };

  static defaultProps = {
    contentStyle: {}
  };

  render() {
    return (
      <Provider filterStore={this.props.store}>
        <View style={styles.container} pointerEvents="box-none">
          <ScrollView
            style={styles.content}
            contentContainerStyle={[
              this.props.contentStyle,
              {
                paddingBottom: Sizes.InnerFrame * 4
              }
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <Filter />
          </ScrollView>

          <View style={styles.toggleBottom}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.onClose}>
              <ProductCount labelStyle={{ color: "white" }} />
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  content: {
    padding: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  toggleBottom: {
    backgroundColor: Colours.Primary
  }
});
