import {
  StatusBar,
  Dimensions,
  Platform,
  PixelRatio,
  StyleSheet
} from "react-native";
import ExtraDimensions from "react-native-extra-dimensions-android";
import { isIphoneX } from "react-native-iphone-x-helper";

// platform specific to accomodate soft buttons on android
const WIDTH
  = Platform.OS === "ios"
    ? Dimensions.get("window").width
    : ExtraDimensions.get("REAL_WINDOW_WIDTH");
const HEIGHT
  = Platform.OS === "ios"
    ? Dimensions.get("window").height
    : ExtraDimensions.get("REAL_WINDOW_HEIGHT")
      - ExtraDimensions.get("STATUS_BAR_HEIGHT")
      - ExtraDimensions.get("SOFT_MENU_BAR_HEIGHT")
      - ExtraDimensions.get("SMART_BAR_HEIGHT");

const BASE_WIDTH = 375; // constant, 375 is standard width of iphone 6 / 7 / 8

// font scaling amount
const FONT_SCALING = WIDTH > 320 ? 1 : 0.8;

export const ResponsiveFontSize = size => {
  // get ratio based on your standard scale
  const ratio = size / BASE_WIDTH;
  return Math.round(ratio * WIDTH);
};

export const Sizes = {
  Width: WIDTH,
  Height: HEIGHT,
  Ratio: 1 / PixelRatio.get(1),
  Hairline: StyleSheet.hairlineWidth,

  // device specific
  ScreenTop: isIphoneX() ? 44 : 30,
  ScreenBottom: isIphoneX() ? 34 : 0,
  StatusBar: Platform.OS === "ios" ? 20 : StatusBar.currentHeight,

  // search
  SearchBarHeight: 36,

  // margins
  OuterFrame: 25,
  InnerFrame: 15,

  // text
  Oversized: ResponsiveFontSize(32),
  H1: ResponsiveFontSize(24),
  H2: ResponsiveFontSize(22),
  H3: ResponsiveFontSize(21),
  Text: ResponsiveFontSize(20),
  SmallText: ResponsiveFontSize(16),
  TinyText: ResponsiveFontSize(14),

  // weights
  Obese: "800",
  Heavy: "700",
  Bold: "bold",
  Medium: "500",
  Normal: "300",
  Light: "100",

  // div
  Divider: 15,

  // decor
  RoundedBorders: 5,

  // buttons
  SquareButton: 75,
  IconButton: 20,
  Avatar: 40,
  SocialButton: 30,
  ActionButton: ResponsiveFontSize(30),
  NavLeft: Platform.OS == "ios" ? 18 : 36,
  Button: 44,

  // apple specific
  TabBarButton: 23,
  TabBarText: 10,

  // spacer
  Spacer: 1 / PixelRatio.get(),

  // helper
  getSizeForScreen: px => {
    const screenWidth = WIDTH;
    const pxx = px / PixelRatio.get(1);

    return pxx > screenWidth ? pxx : screenWidth;
  }
};

export default Sizes;
