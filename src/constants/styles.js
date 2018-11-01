import Sizes from "./sizes";
import Colours from "./colours";

export const Styles = {
  // text
  Text: {
    fontWeight: Sizes.Normal,
    fontSize: Sizes.Text,
    color: Colours.Text,
    backgroundColor: Colours.Transparent
  },

  Medium: {
    fontWeight: Sizes.Medium
  },

  Underlined: {
    textDecorationLine: "underline"
  },

  Emphasized: {
    fontWeight: Sizes.Bold,
    color: Colours.EmphasizedText
  },

  Print: {
    fontFamily: "Chronicle Display"
  },

  Terminal: {
    fontFamily: "Menlo-Regular"
  },

  Modern: {
    fontFamily: "Montserrat-ExtraBold"
  },

  Title: {
    fontSize: Sizes.H1,
    fontWeight: Sizes.Heavy
  },

  SectionTitle: {
    fontSize: Sizes.Text,
    fontWeight: "bold",
    maxWidth: 3 * Sizes.Width / 4,
    fontFamily: "Helvetica",
    color: Colours.EmphasizedText
  },

  SectionSubtitle: {
    fontSize: Sizes.Text,
    fontFamily: "Helvetica",
    color: Colours.SubduedText
  },

  Oversized: {
    fontSize: Sizes.Oversized,
    fontWeight: Sizes.Heavy,
    lineHeight: Sizes.Oversized * 1.2
  },

  Subtitle: {
    color: Colours.SubduedText
  },

  SmallText: {
    fontSize: Sizes.SmallText
  },

  TinyText: {
    fontSize: Sizes.TinyText
  },

  PillText: {
    fontSize: Sizes.H2
  },

  TabBarText: {
    fontSize: Sizes.TabBarText,
    fontWeight: Sizes.Normal
  },

  FilterBarText: {
    fontSize: Sizes.H2
  },

  Alternate: {
    backgroundColor: Colours.Transparent,
    color: Colours.AlternateText,
    borderBottomColor: Colours.AlternateText
  },

  Subdued: {
    color: Colours.SubduedText
  },

  Center: {
    textAlign: "center"
  },

  // containers
  Card: {
    backgroundColor: Colours.Foreground,
    padding: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  TopSpacing: {
    marginTop: Sizes.Divider
  },

  BottomSpacing: {
    marginBottom: Sizes.Divider
  },

  BottomHalfSpacing: {
    marginBottom: Sizes.Divider / 2
  },

  EqualColumns: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  Horizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },

  // combination of Text, Emphasized, and SmallText
  // requires to be manually updated here if
  // above changes
  Input: {
    flex: 1,
    color: Colours.EmphasizedText,
    backgroundColor: Colours.Transparent,
    fontSize: Sizes.Text
  },

  // fix to align indicator with icons
  IconOffset: {
    marginRight: Sizes.InnerFrame / 2.5
  },

  RoundedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame * 2,
    paddingVertical: Sizes.InnerFrame / 2,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.PositiveButton
  },

  RoundedButtonText: {
    color: Colours.Foreground,
    fontWeight: Sizes.Bold
  },

  RoundedSubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.DisabledButton
  },

  Divider: {
    marginVertical: Sizes.InnerFrame * 2,
    marginRight: Sizes.Width / 2,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: Colours.Text
  },

  Separator: {
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.OuterFrame,
    borderColor: Colours.Background,
    borderBottomWidth: 1,
    width: Sizes.Width
  },

  Overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  Unflex: {
    flex: undefined
  }
};

export default Styles;
