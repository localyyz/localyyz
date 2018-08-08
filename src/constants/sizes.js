import { Dimensions, Platform, PixelRatio } from "react-native";
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

// font scaling amount
const FONT_SCALING = WIDTH > 320 ? 1 : 0.8;

export const Sizes = {
  Width: WIDTH,
  Height: HEIGHT,

  // device specific
  ScreenTop: isIphoneX() ? 44 : 30,
  ScreenBottom: isIphoneX() ? 34 : 0,

  // margins
  OuterFrame: 25,
  InnerFrame: 15,

  // text
  Oversized: 32 * FONT_SCALING,
  H1: 24 * FONT_SCALING,
  H2: 22 * FONT_SCALING,
  H3: 18 * FONT_SCALING,
  Text: 16 * FONT_SCALING,
  SmallText: 14,
  TinyText: 12,

  // weights
  Obese: "800",
  Heavy: "700",
  Bold: "600",
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
  NavLeft: Platform.OS == "ios" ? 18 : 36,

  // apple specific
  TabBarButton: 23,
  TabBarText: 10,

  // spacer
  Spacer: 1 / PixelRatio.get()
};

export default Sizes;
