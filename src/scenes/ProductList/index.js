import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import { ContentCoverSlider, ProductList, NavBar } from "localyyz/components";
import { Styles, Sizes, Colours } from "localyyz/constants";

// third party
import { observer } from "mobx-react/native";

// local
import Store from "./store";

@withNavigation
@observer
export default class ProductListScene extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.store = new Store(props.navigation.state.params);
    this.state = {
      headerHeight: 0
    };
  }

  componentDidMount() {
    this.store.fetchNextPage();
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          title={this.props.navigation.state.params.title}
          backAction={() => this.props.navigation.goBack()}
          backColor={Colours.Text}
          background={
            <View
              onLayout={e =>
                this.setState({ headerHeight: e.nativeEvent.layout.height })
              }>
              <View style={styles.header}>
                {this.props.navigation.state.params.title ? (
                  <Text style={styles.headerLabel}>
                    {this.props.navigation.state.params.title}
                  </Text>
                ) : null}
                {this.props.navigation.state.params.subtitle ? (
                  <Text style={styles.headerSublabel}>
                    {this.props.navigation.state.params.subtitle}
                  </Text>
                ) : null}
              </View>
            </View>
          }>
          <ProductList
            products={this.store.listData.slice()}
            onEndReached={() => this.store.fetchNextPage()}
            scrollEventThrottle={16}
            onScroll={e => this.refs.container.onScroll(e)}
            backgroundColor={Colours.Foreground}
            style={[styles.content, { marginTop: this.state.headerHeight }]}/>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  header: {
    ...Styles.Card,
    marginBottom: Sizes.InnerFrame,
    marginTop: Sizes.OuterFrame * 5,
    paddingHorizontal: null,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  headerSublabel: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  },

  content: {
    paddingVertical: Sizes.InnerFrame,
    paddingBottom: NavBar.HEIGHT * 5
  }
});
