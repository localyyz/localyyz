import { Dimensions } from "react-native";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const Sizes = {
  Width: WIDTH,
  Height: HEIGHT,

  // margins
  OuterFrame: 25,
  InnerFrame: 15,

  // text
  Oversized: 32,
  H1: 24,
  H2: 22,
  H3: 18,
  Text: 16,
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
  IconButton: 25,
  Avatar: 40
};

export default Sizes;
