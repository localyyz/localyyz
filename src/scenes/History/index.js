import React from "react";
import { View, StyleSheet, SectionList, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";

// custom
import { ContentCoverSlider, NavBar } from "localyyz/components";
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
    this.state = {
      headerHeight: 0
    };

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
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

  renderHeader() {
    return (
      <View
        style={styles.header}
        onLayout={e =>
          this.setState({
            headerHeight: e.nativeEvent.layout.height
          })
        }>
        <Text style={styles.headerTitle}>Your browsing history </Text>
        <Text style={styles.headerSubtitle}>
          {
            "Keep an eye on this tab regularly to automatically track price drops since the last time you've viewed a product"
          }
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          title="Browse History"
          idleStatusBarStatus="dark-content"
          background={this.renderHeader()}
          backAction={false}
          backColor={Colours.Text}>
          <SectionList
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            sections={_sectionedHistory(this.props.groups)}
            onScroll={e => this.refs.container.onScroll(e)}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            keyExtractor={(item, i) => `item-${i}`}
            contentContainerStyle={{
              paddingBottom: NavBar.HEIGHT + this.state.headerHeight,
              marginTop: this.state.headerHeight
            }}
            ListEmptyComponent={this.renderEmptyComponent}
            ListFooterComponent={<View style={styles.footer} />}/>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background,
    paddingBottom: NavBar.HEIGHT
  },

  header: {
    paddingTop: Sizes.Height / 8,
    paddingBottom: Sizes.InnerFrame
  },

  headerTitle: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  headerSubtitle: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  },

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
