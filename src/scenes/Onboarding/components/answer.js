import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

import { Colours, Sizes } from "~/src/constants";
import Button, { BUTTON_PADDING } from "./button";

@observer
export default class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.question.data ? props.question.data : []
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.active
      && !prevProps.active
      && this.props.question.fetchPath
    ) {
      // NOTE/TODO: special case...
      // fetch additional data here
      this.props.store
        .fetchQuestionData(this.props.question.fetchPath)
        .then(resp => {
          this.setState({
            data: resp.styles.map(s => ({
              ...s,
              key: this.props.question.id
            }))
          });
        });
    }
  }

  renderAnswer = data => {
    return (
      <Animatable.View key={`topic${data.id}`} style={{ marginBottom: 10 }}>
        <Button
          label={data.label}
          description={data.desc}
          imageUrl={data.imageUrl}
          fullWidth={this.state.data.length % 2 !== 0}
          onPress={() => this.props.store.selectOption(data)}/>
      </Animatable.View>
    );
  };

  render() {
    const { question } = this.props;

    return (
      <ScrollView
        contentContainerStyle={[styles.slide, this.props.slideStyle]}
        numColumns={2}>
        <Text style={styles.sectionTitle}>{question.label}</Text>
        {this.state.data.map((d, i) => this.renderAnswer(d, i))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: BUTTON_PADDING,
    paddingBottom: Sizes.ScreenBottom + Sizes.Height / 5
  },

  sectionTitle: {
    fontSize: Sizes.H2,
    fontWeight: Sizes.Heavy,
    width: Sizes.Width,
    textAlign: "center",
    paddingBottom: Sizes.InnerFrame,
    paddingRight: Sizes.OuterFrame
  }
});
