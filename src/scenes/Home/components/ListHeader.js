import React from "react";
import { StyleSheet, Text, View } from "react-native";

// custom
import { Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";

class ListHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string
  };

  static defaultProps = {
    title: "",
    description: ""
  };

  render() {
    const { title, description } = this.props;

    return (
      <View style={styles.listHeader}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <Text style={styles.sectionHeaderDescription}>{description}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listHeader: {
    marginVertical: Sizes.OuterFrame,
    paddingTop: Sizes.OuterFrame
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
