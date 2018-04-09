import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ContentCoverSlider, NavBar } from "localyyz/components";

export default class InformationScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: null
    };
    this.settings = this.props.navigation.state.params;
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          title={this.settings.title}
          backAction={() => this.props.navigation.goBack()}
          backColor={Colours.Text}
          background={
            <View
              onLayout={e =>
                this.setState({ headerHeight: e.nativeEvent.layout.height })}>
              <View style={[Styles.Card, styles.header]}>
                <Text style={styles.headerLabel}>{this.settings.title}</Text>
              </View>
            </View>
          }>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={e => this.refs.container.onScroll(e)}>
            <View
              style={[
                Styles.Card,
                styles.content,
                this.state.headerHeight && {
                  marginTop: this.state.headerHeight - Sizes.InnerFrame
                }
              ]}>
              {this.settings.content}
            </View>
          </ScrollView>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: NavBar.HEIGHT,
    backgroundColor: Colours.Background
  },

  content: {
    flex: 1
  },

  header: {
    marginBottom: Sizes.InnerFrame,
    marginTop: Sizes.OuterFrame * 3,
    paddingHorizontal: null,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.SectionTitle
  }
});
