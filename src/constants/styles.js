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
    fontSize: Sizes.H2,
    fontWeight: Sizes.Heavy
  },

  SectionTitle: {
    fontSize: Sizes.H2,
    fontWeight: Sizes.Heavy,
    marginHorizontal: Sizes.OuterFrame
  },

  SectionSubtitle: {
    fontSize: Sizes.Text,
    marginTop: Sizes.InnerFrame / 2,
    marginHorizontal: Sizes.OuterFrame,
    paddingRight: Sizes.Width / 4
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
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame
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
    fontSize: Sizes.SmallText
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

  Divider: {
    marginVertical: Sizes.InnerFrame * 2,
    marginRight: Sizes.Width / 2,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: Colours.Text
  }
};

export default Styles;
