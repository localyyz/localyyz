import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Sizes } from "localyyz/constants";

// local
import { MissedCard } from "./components";

@inject(stores => ({
  missed: stores.dealStore.featuredMissed,
  fetch: stores.dealStore.fetchMissed
}))
@observer
export default class MissedDeals extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.fetch();
  }

  renderItem({ item: deal }) {
    return <MissedCard navigation={this.props.navigation} deal={deal} />;
  }

  render() {
    return this.props.missed.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          numColumns={2}
          columnWrapperStyle={styles.wrapper}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={deal => `deal-${deal.id}`}
          data={this.props.missed && this.props.missed.slice()}/>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.InnerFrame / 4,
    marginBottom: Sizes.InnerFrame
  },

  wrapper: {
    flex: 1,
    flexWrap: "wrap",
    marginTop: Sizes.InnerFrame / 4
  }
});
