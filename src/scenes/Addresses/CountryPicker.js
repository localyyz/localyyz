import React from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableHighlight
} from "react-native";

import { Styles, Sizes, Colours } from "~/src/constants";
import { deviceStore } from "~/src/stores";

import AddressStore from "~/src/stores/AddressStore";

export default class CountryPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      _options: [],
      _current: [],
      _page: 1,
      _limit: 10
    };

    // must be required props
    this.update = props.navigation.getParam("update");
  }

  componentDidMount = () => {
    const deviceCountryCode = deviceStore.getDeviceCountry();
    AddressStore.fetchCountries().then(resolved => {
      if (resolved.countries) {
        let countries = [];
        for (let country of resolved.countries) {
          let c = {
            value: country.alpha2Code,
            name: country.name,
            nativeName: country.nativeName,
            key: country.alpha2Code
          };

          if (c.key == deviceCountryCode) {
            countries.unshift({
              ...c,
              isSuggested: true,
              description: "Suggested country:"
            });
          } else {
            countries.push(c);
          }
        }

        this.setState({
          countries: countries,
          _options: countries.slice(0, this.state._limit)
        });
      }
    });
  };

  onEndReached = () => {
    let start = this.state._page * this.state._limit;
    let end = start + this.state._limit;

    if (start > this.state.countries.length) {
      return;
    }

    this.setState({
      _options: this.state._options.concat(
        this.state.countries.slice(start, end)
      ),
      _page: this.state._page + 1
    });
  };

  onSelect = value => {
    this.update(value);
  };

  renderItem = ({ item: country }) => {
    const label
      = country.name == country.nativeName ? country.name : country.nativeName;

    return (
      <TouchableHighlight
        style={{ width: Sizes.Width }}
        onPress={() =>
          this.onSelect({
            country: country.nativeName,
            countryCode: country.value
          })
        }
        underlayColor={Colours.Background}>
        <View
          style={[styles.row, country.isSuggested ? styles.suggestedRow : {}]}>
          {country.description ? (
            <Text style={styles.rowDescription}>{country.description}</Text>
          ) : null}
          <Text style={styles.rowText}>{label}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <FlatList
        renderItem={this.renderItem}
        keyExtractor={o => o.key}
        scrollEventThrottle={16}
        maxToRenderPerBatch={10}
        initialNum={10}
        removeClippedSubviews={true}
        data={this.state._options}
        contentContainerStyle={styles.container}
        onEndReached={this.onEndReached}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              borderBottomWidth: Sizes.Hairline,
              borderBottomColor: Colours.Border
            }}/>
        )}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.OuterFrame,
    paddingBottom: Sizes.IOSTabBar + Sizes.OuterFrame * 2
  },

  row: {
    paddingVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    justifyContent: "center",
    height: Sizes.Height / 10
  },

  suggestedRow: {
    marginBottom: Sizes.OuterFrame
  },

  rowText: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  rowDescription: {
    ...Styles.SmallText,
    color: Colours.SubduedText,
    paddingBottom: 5
  }
});
