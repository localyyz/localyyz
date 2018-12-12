import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

// custom
import { Sizes, Colours } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import { ifIphoneX } from "react-native-iphone-x-helper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

@inject(stores => ({
  message: stores.supportStore.message
}))
@observer
export default class ProductSupport extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => {
          this.props.message();
        }}>
        <MaterialCommunityIcon
          name={"facebook-messenger"}
          size={Sizes.ActionButton}
          color={Colours.Foreground}/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  supportButton: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: Sizes.OuterFrame / 2,
    paddingTop: Sizes.OuterFrame / 3,
    ...ifIphoneX(
      {
        marginVertical: Sizes.InnerFrame * 2.25
      },
      {
        marginVertical: Sizes.InnerFrame * 1.5
      }
    )
  }
});
