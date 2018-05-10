import React from "react";
import { StyleSheet, Text, View } from "react-native";

// custom
import { Sizes, Colours, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";

class ListHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string
  };

  render() {
    const { title, description } = this.props;

    return title || description ? (
      <View
        style={[
          styles.listHeader,
          !!description && styles.listHeaderWithDescription
        ]}>
        {title ? <Text style={styles.sectionHeader}>{title}</Text> : null}
        {description ? (
          <Text style={styles.sectionHeaderDescription}>{description}</Text>
        ) : null}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  listHeader: {
    paddingTop: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  listHeaderWithDescription: {
    paddingBottom: Sizes.OuterFrame,
    backgroundColor: Colours.Transparent
  },

  sectionHeader: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  sectionHeaderDescription: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  }
});

export default ListHeader;
