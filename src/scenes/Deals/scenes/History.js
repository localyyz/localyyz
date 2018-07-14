import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";

// third party
import { Provider, inject, observer } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { BaseScene } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

export default class DealsHistoryScene extends React.Component {
  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params || {};
  }

  render() {
    return (
      <Provider dealStore={this.settings.dealStore}>
        <View style={styles.container}>
          <BaseScene
            title="Previous deals"
            titleColor={Colours.AlternateText}
            backColor={Colours.AlternateText}
            backAction={this.props.navigation.goBack}
            idleStatusBarStatus="light-content">
            <Deals navigation={this.props.navigation} />
          </BaseScene>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.MenuBackground
  }
});

@inject(stores => ({
  deals: stores.dealStore.missed,
  fetch: stores.dealStore.fetchMissed
}))
@observer
class Deals extends React.Component {
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
    return (
      <FlatList
        data={this.props.deals && this.props.deals.slice()}
        renderItem={this.renderItem}
        keyExtractor={deal => `missed-deal-${deal.id}`}/>
    );
  }
}

class MissedCard extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    return this.props.navigation.navigate("MissedDeal", {
      deal: this.props.deal
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={cStyles.container}>
        <View style={cStyles.header}>
          <Text numberOfLines={1} style={cStyles.title}>
            {this.props.deal.name}
          </Text>
          <Text style={cStyles.claimed}>{`${Math.round(
            this.props.deal.percentageClaimed * 100
          )}% claimed`}</Text>
          <View style={cStyles.arrow}>
            <MaterialIcon
              name="keyboard-arrow-right"
              size={Sizes.Text}
              color={Colours.AlternateText}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const cStyles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  title: {
    ...Styles.Text,
    ...Styles.Alternate,
    flex: 1
  },

  claimed: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginLeft: Sizes.InnerFrame
  },

  arrow: {
    marginLeft: Sizes.InnerFrame / 2
  }
});
