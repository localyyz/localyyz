import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView
} from "react-native";

// custom
import { ApiInstance } from "localyyz/global";
import { capitalize } from "localyyz/helpers";
import { Styles, Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import Accordion from "react-native-collapsible/Accordion";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export class ShippingPolicy extends React.Component {
  static propTypes = {
    // mobx injected
    placeId: PropTypes.numeric
  };

  constructor(props) {
    super(props);
    this.state = {
      zones: []
    };
  }

  componentDidMount() {
    // fetch place shipping... TODO place should wrap this func
    ApiInstance.get(`/places/${this.props.placeId}/shipping`).then(resolve => {
      if (!resolve.error) {
        let zones = {};
        // TODO: move to place model!
        // -> keyed off country

        for (let z of resolve.data) {
          // initialize empty array grouped by country
          zones[z.country] = zones[z.country] || [];

          zones[z.country].push(z);
        }

        this.setState({ zones });
      }
    });
  }

  zoneRequirement = zone => {
    switch (zone.type) {
      case "price":
        return zone.subtotalLow > 0.0 ? `spend over $${zone.subtotalLow}` : "";
    }
  };

  renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.country}>{capitalize(section.title)}</Text>;
        <MaterialIcon name="expand-more" size={20} />
      </View>
    );
  };

  renderContent = section => {
    return (
      <View style={styles.zones}>
        {section.content.map(zone => {
          return (
            <View
              key={zone.id}
              style={[styles.zone, zone.price == 0.0 ? styles.free : {}]}>
              <Text>{zone.description}</Text>
              <Text style={styles.price}>
                {zone.price === 0.0 ? "Free" : `$${zone.price}`}
              </Text>
              {zone.type === "price" ? (
                <Text>{this.zoneRequirement(zone)}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  get renderZones() {
    const SECTIONS = Object.keys(this.state.zones).map(country => ({
      title: country,
      content: this.state.zones[country]
    }));

    return (
      <Accordion
        activeSection={this.state.activeSection}
        sections={SECTIONS}
        onChange={this.setSection}
        initiallyActiveSection={0}
        renderHeader={this.renderHeader}
        renderContent={this.renderContent}
        touchableComponent={TouchableWithoutFeedback}/>
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          {this.renderZones}
          <View style={styles.zones}>
            <Text style={Styles.Subtitle}>
              All other rates available at checkout.
            </Text>
          </View>
          {this.props.shippingPolicyUrl ? (
            <TouchableOpacity onPress={() => Linking.openURL("")}>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}> Read more</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

export default ShippingPolicy;

const styles = StyleSheet.create({
  content: {
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.ScreenTop,
    marginBottom: Sizes.ScreenBottom
  },

  header: {
    paddingBottom: Sizes.InnerFrame,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  zones: {
    paddingBottom: Sizes.InnerFrame
  },

  zone: {
    borderBottomWidth: Sizes.Hairline,
    borderBottomColor: Colours.Border,
    paddingVertical: Sizes.InnerFrame
  },

  free: {
    backgroundColor: Colours.Success
  },

  price: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  country: {
    ...Styles.Text,
    ...Styles.Title
  },

  button: {
    ...Styles.RoundedButton,
    marginTop: Sizes.InnerFrame,
    height: Sizes.InnerFrame * 2,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    color: Colours.ButtonLabel
  }
});
