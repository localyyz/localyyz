import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// custom
import { NAVBAR_HEIGHT, Sizes } from "localyyz/constants";

// local
import BlockHeader from "./BlockHeader";
import BlockItem from "./BlockItem";

export default class Blocks extends React.Component {
  // props
  // blocks
  // onScrollAnimate

  constructor(props) {
    super(props);
    this.state = {
      isLayoutReady: false,
      selectedIdx: 0
    };
  }

  onSelectSection = index => {
    this.setState({ selectedIdx: index });
  };

  renderItem = ({ item: block, index: i }) => {
    return i === this.state.selectedIdx ? (
      <BlockItem index={i} block={block} />
    ) : (
      <View />
    );
  };

  render() {
    const headers = this.props.blocks.map(b => b.title);
    return (
      <View style={styles.contentContainer}>
        <FlatList
          ref="blocks"
          data={this.props.blocks.slice()}
          keyExtractor={block => `block-${block.id}`}
          contentContainerStyle={styles.content}
          extraData={this.state}
          ListHeaderComponent={() => {
            return (
              <BlockHeader
                headers={headers}
                selectedSection={headers && headers[this.state.selectedIdx]}
                onSelectSection={this.onSelectSection}/>
            );
          }}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={this.props.onScrollAnimate}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },

  content: {
    paddingBottom: NAVBAR_HEIGHT
  }
});
