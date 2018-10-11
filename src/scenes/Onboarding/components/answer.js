import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { observer } from "mobx-react/native";

import { Sizes, Styles } from "~/src/constants";
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
      <View key={`topic${data.id}`} style={{ paddingBottom: BUTTON_PADDING }}>
        <Button
          label={data.label}
          description={data.desc}
          imageUrl={data.imageUrl}
          fullWidth={this.state.data.length % 2 !== 0}
          onPress={() => this.props.store.selectOption(data)}/>
      </View>
    );
  };

  render() {
    const { question } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.slide} numColumns={2}>
        <Text style={styles.sectionTitle}>{question.label}</Text>
        {this.state.data.map(d => this.renderAnswer(d))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Sizes.OuterFrame * 3,
    paddingHorizontal: BUTTON_PADDING,
    paddingBottom: Sizes.ScreenBottom + Sizes.Height / 5
  },

  sectionTitle: {
    fontSize: Sizes.H2,
    fontWeight: Sizes.Heavy,
    paddingBottom: Sizes.InnerFrame,
    paddingRight: Sizes.OuterFrame
  }
});
