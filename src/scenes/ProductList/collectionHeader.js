import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";

export default class CollectionHeader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.title}>{this.props.name}</Text>
          <View style={styles.metrics}>
            <Text style={styles.subtitle}>
              {this.props.productCount} Products
            </Text>
            <Text style={[styles.subtitle, { paddingHorizontal: 2 }]}>•</Text>
            <Text style={styles.subtitle}>0 followers</Text>
          </View>
          <Text style={styles.description}>{this.props.description}</Text>
        </View>

        <View
          style={{
            paddingVertical: 5,
            flexDirection: "row",
            justifyContent: "flex-end"
          }}>
          {(this.props.collaborators || []).map(c => (
            <View key={c.id} style={styles.collaborator}>
              <Image source={{ uri: c.avatarUrl }} style={styles.avatar} />
              <Text style={{ textAlign: "center" }}>{c.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame
  },

  info: {
    width: 3 * Sizes.Width / 4
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Title,
    paddingVertical: 5
  },

  metrics: {
    ...Styles.Horizontal,
    paddingVertical: 5
  },

  subtitle: {
    color: Colours.SubduedText,
    fontSize: Sizes.SmallText
  },

  description: {
    paddingVertical: 5
  },

  collaborator: {
    alignItems: "center",
    width: Sizes.Avatar + 5,
    height: Sizes.Avatar + 5
  },

  avatar: {
    width: Sizes.Avatar,
    height: Sizes.Avatar,
    borderRadius: Sizes.Avatar / 2
  }
});
