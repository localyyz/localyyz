import React from "react";
import { View } from "react-native";
import { observer, inject } from "mobx-react/native";

import { Colours, Sizes } from "~/src/constants";

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.onboardingStore;
  }

  renderPagination = () => {
    const total = this.store.questions.length;
    const index = this.store.slideIndex;

    const pageWidth = (Sizes.Width - 10) / total;
    const pageStyle = {
      backgroundColor: Colours.Background,
      height: 6,
      width: pageWidth,
      borderRightWidth: Sizes.Hairline,
      borderRightColor: Colours.Border
    };
    const activeStyle = { backgroundColor: Colours.Accented };

    let pages = [];
    const Page = <View style={pageStyle} />;
    const ActivePage = <View style={[pageStyle, activeStyle]} />;

    for (let i = 0; i < total; i++) {
      pages.push(
        i <= index
          ? React.cloneElement(ActivePage, { key: i })
          : React.cloneElement(Page, { key: i })
      );
    }

    return pages;
  };

  render() {
    const containerStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: Sizes.ScreenTop + Sizes.InnerFrame,
      paddingBottom: Sizes.InnerFrame,
      paddingHorizontal: 10,
      backgroundColor: Colours.Foreground
    };

    const paginationStyle = {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    };

    return (
      <View style={containerStyle}>
        <View pointerEvents="none" style={paginationStyle}>
          {this.renderPagination()}
        </View>
      </View>
    );
  }
}
