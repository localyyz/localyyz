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

export const ResponsiveFontSize = size => {
  // get ratio based on your standard scale
  const ratio = size / BASE_WIDTH;
  return Math.round(ratio * WIDTH);
};

export const Sizes = {
  Width: WIDTH,
  Height: HEIGHT,
  Ratio: 1 / PixelRatio.get(1),

  // device specific
  ScreenTop: isIphoneX() ? 44 : 30,
  ScreenBottom: isIphoneX() ? 34 : 0,
  StatusBar:
    Platform.OS === "ios" ? (isIphoneX() ? 44 : 40) : StatusBar.currentHeight,

  // Tabbar
  IOSTabBar: 48 + isIphoneX() ? 34 : 0,

  // search
  SearchBarHeight: 36,

  // margins
  OuterFrame: ResponsiveFontSize(25),
  InnerFrame: ResponsiveFontSize(15),

  // text
  Oversized: ResponsiveFontSize(32),
  LargeInput: ResponsiveFontSize(22),
  H1: ResponsiveFontSize(24),
  H2: ResponsiveFontSize(22),
  H3: ResponsiveFontSize(21),
  Text: ResponsiveFontSize(20),
  MediumText: ResponsiveFontSize(19),
  SmallText: ResponsiveFontSize(16),
  TinyText: ResponsiveFontSize(14),
  MiniText: ResponsiveFontSize(12),

  // iOS default is probably 18
  LineHeightOneHalf: ResponsiveFontSize(27),

  // weights
  Obese: "800",
  Heavy: "700",
  Bold: "bold",
  Emphasized: "600",
  Medium: "500",
  Normal: "300",
  Light: "100",

  // div
  Divider: 15,

  // decor
  RoundedBorders: 5,
  ThickBorder: ResponsiveFontSize(2),
  Hairline: StyleSheet.hairlineWidth,

  // buttons
  SquareButton: 75,
  IconButton: 20,
  Avatar: 40,
  SocialButton: 30,
  ActionButton: ResponsiveFontSize(28),
  NavLeft: ResponsiveFontSize(28),
  Button: 44,

  // apple specific
  TabBarButton: 23,
  TabBarText: 10,

  // badge
  BadgeMarginTop: ResponsiveFontSize(7),
  BadgeMarginRight: -ResponsiveFontSize(6),
  BadgeText: ResponsiveFontSize(13),
  BadgeIcon: ResponsiveFontSize(30),

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
