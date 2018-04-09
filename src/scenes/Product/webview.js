import React from "react"
import PropTypes from "prop-types"
import { View, Text, TouchableWithoutFeedback, WebView } from "react-native"

const BODY_TAG_PATTERN = /\<\/ *body\>/

// Do not add any comments to this! It will break because all line breaks will removed for
// some weird reason when this script is injected.
const script = `
;(function() {
var wrapper = document.createElement("div");
wrapper.id = "height-wrapper";
while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
}
document.body.appendChild(wrapper);
var i = 0;
function updateHeight() {
    document.title = wrapper.clientHeight;
    window.location.hash = ++i;
}
updateHeight();
window.addEventListener("load", function() {
    updateHeight();
    setTimeout(updateHeight, 1000);
});
window.addEventListener("resize", updateHeight);
}());
`

const style = `
<style>
body, html, #height-wrapper {
    margin: 0;
    padding: 0;
    font-family: Oswald;
}
#height-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
h1 {
    font-size: 18;
}
h2 {
    font-size: 16;
}
h3 {
    font-size: 14;
}
</style>
<script>
${script}
</script>
`

const codeInject = html => html.replace(BODY_TAG_PATTERN, style + "</body>")

class WebViewAutoHeight extends React.Component {
  static propTypes = {
    minHeight: PropTypes.number
  }

  static defaultProps = {
    minHeight: 150
  }

  constructor(props) {
    super(props)

    this.state = {
      realContentHeight: this.props.minHeight,
      viewMore: false
    }
  }

  handleNavigationChange(navState) {
    //console.log(navState,'here')
    if (navState && navState.title) {
      const realContentHeight = parseInt(navState.title, 10) || 0 // turn NaN to 0
      this.setState({ realContentHeight })
    }
    if (typeof this.props.onNavigationStateChange === "function") {
      this.props.onNavigationStateChange(navState)
    }
  }

  render() {
    const { source, style, minHeight, ...otherProps } = this.props
    const { realContentHeight, viewMore } = this.state
    const html = source.html

    if (!html) {
      throw new Error("WebViewAutoHeight supports only source.html")
    }

    if (!BODY_TAG_PATTERN.test(html)) {
      throw new Error("Cannot find </body> from: " + html)
    }

    //console.log("wh", Math.max(this.state.realContentHeight, minHeight))
    const height = viewMore ? Math.max(realContentHeight, minHeight) : minHeight
    const webView = (
      <WebView
        {...otherProps}
        source={{ html: codeInject(html) }}
        scrollEnabled={false}
        style={[
          { height: height, shadowOffset: { width: 10, height: 10 } },
          style
        ]}
        javaScriptEnabled={true}
        dataDetectorTypes="none"
        onNavigationStateChange={data => {
          this.handleNavigationChange(data)
        }}
      />
    )

    return (
      <View style={{ height: height }}>
        {viewMore
          ? webView
          : <TouchableWithoutFeedback
              onPress={() => this.setState({ viewMore: true })}
            >
              <View style={{ flex: 1 }}>
                {webView}
                <Text
                  style={{
                    padding: 10,
                    fontFamily: "Oswald",
                    textAlign: "right"
                  }}
                >
                  View More...
                </Text>
              </View>
            </TouchableWithoutFeedback>}
      </View>
    )
  }
}

export default WebViewAutoHeight
