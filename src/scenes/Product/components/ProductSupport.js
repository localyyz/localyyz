import React from "react";

// custom
import { Sizes } from "~/src/constants";
import { supportStore } from "~/src/stores";

// third party
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default class ProductSupport extends React.Component {
  render() {
    return (
      <MaterialCommunityIcon.Button
        color="black"
        backgroundColor="transparent"
        iconStyle={{ marginRight: 5 }}
        size={Sizes.ActionButton}
        name={"facebook-messenger"}
        onPress={supportStore.message}/>
    );
  }
}
