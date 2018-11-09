import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { SloppyView } from "~/src/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

const DEALTAB = [
  { id: "ongoing", label: "ONGOING", filterId: "ongoing" },
  { id: "timed", label: "LIMITED TIME", filterId: "timed" },
  { id: "comingsoon", label: "COMING SOON", filterId: "comingsoon" }
];

@inject((stores, props) => ({
  dealTab: (stores.dealStore || props).dealTab,
  setDealTab: (stores.dealStore || props).setDealTab
}))
@observer
export default class DealType extends React.Component {
  render() {
    const buttonWidth = Sizes.Width / DEALTAB.length;
    const textWidth = buttonWidth - Sizes.OuterFrame;
    return (
      <View style={styles.container}>
        {DEALTAB.map(dealTab => {
          const isActive
            = this.props.dealTab && this.props.dealTab.id === dealTab.id;
          return (
            <TouchableOpacity
              key={`dealTab-${dealTab.id}`}
              onPress={() => this.props.setDealTab(dealTab)}>
              <SloppyView
                style={[
                  styles.button,
                  isActive && styles.active,
                  { width: buttonWidth }
                ]}>
                <View style={[styles.option, { maxWidth: textWidth }]}>
                  <Text
                    style={[
                      styles.label,
                      isActive && {
                        fontWeight: "bold",
                        color: Colours.Foreground
                      }
                    ]}
                    numberOfLines={2}>
                    {dealTab.label}
                  </Text>
                </View>
              </SloppyView>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    backgroundColor: Colours.Foreground,
    borderBottomColor: Colours.Border,
    borderBottomWidth: Sizes.Hairline
  },

  button: {
    height: Sizes.OuterFrame * 3,
    justifyContent: "center",
    alignItems: "center"
  },

  option: {
    padding: Sizes.InnerFrame / 2
  },

  active: {
    backgroundColor: Colours.Accented
  },

  label: {
    ...Styles.SmallText,
    textAlign: "center"
  }
});
