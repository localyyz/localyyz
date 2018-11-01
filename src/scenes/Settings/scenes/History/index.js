import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react/native";

// custom
import HistoryItem from "./components/HistoryItem";

@inject(stores => ({
  products: stores.historyStore.products,
  groups: stores.historyStore.groups,
  fetchHistory: () => stores.historyStore.fetchHistory()
}))
@observer
export default class HistoryScene extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: "Browsing History"
  });

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
      <SectionList
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        sections={_sectionedHistory(this.props.groups)}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        keyExtractor={(item, i) => `item-${i}`}
        ListEmptyComponent={this.renderEmptyComponent}
        ListFooterComponent={<View style={styles.footer} />}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  itemContainer: {
    ...Styles.Horizontal,
    marginHorizontal: Sizes.InnerFrame,
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
