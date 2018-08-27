import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import PropTypes from "prop-types";

// custom
import { Colours, Styles, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";

export default class BlockHeader extends React.Component {
  // props
  //  headers
  //  onSelectSection
  //  selectedSection
  static propTypes = {
    headers: PropTypes.array.isRequired,
    onSelectSection: PropTypes.func,
    selectedSection: PropTypes.any
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selectedSection !== this.props.selectedSection;
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        style={styles.button}
        onPress={() => this.props.onSelectSection(index)}>
        <SloppyView
          hitSlop={{
            top: Sizes.InnerFrame * 2,
            bottom: Sizes.InnerFrame * 2,
            left: Sizes.InnerFrame,
            right: Sizes.InnerFrame
          }}
          style={[
            styles.option,
            item === this.props.selectedSection ? styles.active : {}
          ]}>
          <Text style={styles.label}>{item}</Text>
        </SloppyView>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyExtractor={(v, i) => `${v}${i}`}
        data={this.props.headers.slice()}
        renderItem={this.renderItem}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame
  },

  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  option: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.OuterFrame * 2 / 3,
    borderRadius: Sizes.InnerFrame
  },

  active: {
    backgroundColor: Colours.Action
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
