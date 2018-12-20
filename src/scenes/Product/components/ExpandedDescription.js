import React from "react";
import { View, StyleSheet, WebView } from "react-native";
import { Colours, Sizes } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

export default class ExpandedDescription extends React.Component {
  static propTypes = {
    description: PropTypes.string
  };

  static defaultProps = {
    description: ""
  };

  render() {
    return (
      <View style={styles.container}>
        <WebView
          javaScriptEnabled
          automaticallyAdjustContentInsets
          scrollEnabled
          source={{
            html: `
              <html><head>
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                  }

                  h1, h2, h3, h4, h5, h6, #content, strong, p, li {
                    font-family: "system font" !important;
                    font-size: ${Sizes.SmallText} !important;
                    line-height: 1.5;
                    font-weight: ${Sizes.Normal};
                  }

                  h1, h2, h3, h4, h5, h6 {
                    font-weight: ${Sizes.Medium} !important;
                  }

                  #content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    margin: 0;
                    padding: 0;
                  }
                </style>
              </head><body>
                <div id="content">
                  ${this.props.description.replace(/<img[^>]*>/g, "")}
                </div>
              </body></html>
            `
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Sizes.Height,
    paddingTop: Sizes.OuterFrame + Sizes.ScreenTop,
    paddingBottom: Sizes.OuterFrame + Sizes.ScreenBottom,
    paddingHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
