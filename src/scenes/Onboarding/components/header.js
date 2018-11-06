import React from "react";
import { View } from "react-native";
import { HeaderBackButton } from "react-navigation";

import { Colours, Sizes } from "~/src/constants";

export default class Header extends React.Component {
  render() {
    const { context, index } = this.props;

    const pageWidth = (Sizes.Width - 10) / context.props.children.length;
    const pageStyle = {
      backgroundColor: Colours.Background,
      height: 10,
      width: pageWidth
    };
    const activeStyle = { backgroundColor: Colours.Accented };

    let pages = [];
    const Page = <View style={pageStyle} />;
    const ActivePage = <View style={[pageStyle, activeStyle]} />;

    for (let i = 0; i < context.state.total; i++) {
      pages.push(
        i <= context.state.index
          ? React.cloneElement(ActivePage, { key: i })
          : React.cloneElement(Page, { key: i })
      );
    }

    const containerStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: Sizes.ScreenTop + 60,
      paddingTop: Sizes.ScreenTop,
      paddingBottom: 10,
      paddingHorizontal: 10,
      backgroundColor: Colours.Foreground
    };

    const paginationStyle = {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    };

    const onBack = index == 0 ? this.props.onExit : this.props.onBack;
    const title = index == 0 ? "Quit" : "Back";

    return (
      <View style={containerStyle}>
        <HeaderBackButton
          title={title}
          onPress={onBack}
          tintColor={Colours.Tint}/>
        <View pointerEvents="none" style={paginationStyle}>
          {pages}
        </View>
      </View>
    );
  }
}
