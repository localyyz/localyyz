import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react/native";

// custom
import { BaseScene } from "localyyz/components";
import HistoryItem from "./components/HistoryItem";

@inject(stores => ({
  products: stores.historyStore.products,
  groups: stores.historyStore.groups,
  fetchHistory: () => stores.historyStore.fetchHistory()
}))
@observer
export default class HistoryScene extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
  }

  componentDidMount() {
    this.props.fetchHistory();
  }

  renderItem({ item }) {
    return (
      <HistoryItem
        product={this.props.products[item.productId]}
        lastPrice={item.price}
        lastViewedAt={item.lastViewed}/>
    );
  }

  renderSectionHeader({ section }) {
    return (
      <View style={[styles.itemContainer, styles.sectionHeader]}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  }

  renderEmptyComponent() {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyLabel}>
          <Text style={styles.emptyLabelTitle}>
            You have no browsing history.
          </Text>
          {" We'll keep track of the products you view on Localyyz here."}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <BaseScene
        title="Browse history"
        backAction={this.props.navigation.goBack}>
        <SectionList
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          sections={_sectionedHistory(this.props.groups)}
          onScroll={e => this.refs.container.onScroll(e)}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={(item, i) => `item-${i}`}
          ListEmptyComponent={this.renderEmptyComponent}
          ListFooterComponent={<View style={styles.footer} />}/>
      </BaseScene>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    ...Styles.Horizontal,
    marginHorizontal: Sizes.OuterFrame,
    marginVertical: Sizes.InnerFrame / 8,
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  sectionHeader: {
    backgroundColor: Colours.Transparent,
    marginVertical: null,
    marginTop: Sizes.InnerFrame / 2,
    padding: null,
    paddingVertical: Sizes.InnerFrame / 2
  },

  sectionHeaderLabel: {
    ...Styles.Text,
    ...Styles.TinyText
  },

  footer: {
    marginBottom: Sizes.InnerFrame
  },

  empty: {
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame
  },

  emptyLabel: {
    ...Styles.Text,
    paddingRight: Sizes.Width / 3
  },

  emptyLabelTitle: {
    ...Styles.Emphasized
  }
});

function _sectionedHistory(history) {
  return Object.keys(history).map(label => ({
    data: history[label],
    title: label
  }));
}
