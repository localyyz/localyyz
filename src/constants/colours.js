// defined colors
let Foreground = "#FFFFFF";
let Black = "#000000";
let Grey = "rgb(200, 200, 200)";
let NearBlack = "rgb(30, 30, 30)";
let Red = "#FF0000";
let Pink = "#C73B6F";
let DarkGold = "#856f03";
let Text = NearBlack;
let Transparent = "rgba(255, 255, 255, 0)";
let BlackTransparent = "rgba(0, 0, 0, 0)";
let DarkTransparent = "rgba(0, 0, 0, 0.8)";
let WhiteTransparent = "rgba(255, 255, 255, 0.9)";
let Shadow = "rgba(0, 0, 0, 0.1)";
let LightDarkShadow = "rgba(0, 0, 0, 0.2)";
let WhiteShadow = "rgba(255, 255, 255, 0.1)";
let LightShadow = "rgba(255, 255, 255, 0.5)";
let Highlight = "rgba(255, 255, 255, 0.1)";
let LightYellow = "#FFFFE0";

let Purple = "#B721FF";
let Blue = "rgb(33, 212, 253)";

// brand colors
let PurpleRain = "#44179E";
let PurpleRainTransparent = "rgba(68, 23, 158, 0)";
let BlueSteel = "#2E62F1";
let UltraViolet = "#9013FE";
let CokeBottleGreen = "#50E3C2";
let SterlingGrey = "#D8D8D8";
let GhostGrey = "#FAFAFA";
let IntoTheGrey = "#313131";

// ken's choice of colours
let FadedGrey = "#EEEEEE";
let LightGrey = "#999999";
let Yellow = "#FFF200";
let LightBlue = "#DEEFF5";

export const Colours = {
  // backgrounds
  Background: FadedGrey,
  Foreground: Foreground,
  Accent: Pink,
  DarkGold: DarkGold,
  SubduedForeground: Grey,
  MenuBackground: Black,
  StatusBar: Black,
  Transparent: Transparent,
  BlackTransparent: BlackTransparent,
  DarkTransparent: DarkTransparent,
  WhiteTransparent: WhiteTransparent,
  Shadow: Shadow,
  LightDarkShadow: LightDarkShadow,
  WhiteShadow: WhiteShadow,
  LightShadow: LightShadow,
  Highlight: Highlight,
  Alert: LightYellow,

  // buttons
  PositiveButton: UltraViolet,
  NegativeButton: Red,
  DisabledButton: LightShadow,
  Clearance: Yellow,
  Action: LightBlue,

  // text
  Text: Text,
  AlternateText: Foreground,
  EmphasizedText: Black,
  SubduedText: LightGrey,
  OnSale: Red,

  // debug
  Facebook: "rgb(59, 89, 153)",

  // gradient
  FirstGradient: Blue,
  SecondGradient: Purple,

  // status
  Success: CokeBottleGreen,
  Fail: Red,

  // brand colors
  Primary: PurpleRain,
  Secondary: BlueSteel,
  Accented: CokeBottleGreen,

  // brand transparencies
  PrimaryTransparent: PurpleRainTransparent,

  // selectors
  Selected: NearBlack,
  Unselected: Grey
};

export default Colours;
