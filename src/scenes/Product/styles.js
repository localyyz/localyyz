import { StyleSheet } from "react-native"
import { Colors, Style } from "localyyz/constants"

export const HeaderHeight = Style.Nav + 20
export const BarHeight = 60

export const ProductHeight = Style.Height - HeaderHeight - BarHeight
const PAD = 11

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  clearTop: {
    flex: 1
  },

  detail: {
    flex: 1
  },

  productTitle: {
    textAlign: "center",
    padding: 5,
    fontWeight: "300",
    backgroundColor: Colors.Navigation
  },

  titletext: {
    fontSize: 18,
    fontWeight: "600"
  },

  product: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
    backgroundColor: "white"
  },

  productimage: {
    flex: 1,
    width: Style.AppWidth - PAD,
    height: Style.AppHeight
    //width: Style.AppWidth
  },

  productinfo: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 15
  },

  productinfotext: {
    fontSize: 18,
    padding: 2
  },

  btntext: {
    fontWeight: "bold",
    fontSize: 16
  },

  cartbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: "row",
    height: BarHeight,
    backgroundColor: Colors.White,
    borderStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: Colors.Border
  },
  cartbaritem: {
    flex: 1
  },
  cartbaritemjustified: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cartbaritemtext: {
    fontSize: 16,
    fontWeight: "500"
  },

  cartadd: {
    position: "absolute",
    flex: 1,
    top: 0,
    bottom: BarHeight,
    left: 0,
    right: 0,
    backgroundColor: Colors.Backdrop
  },

  cartsizelist: {
    backgroundColor: Colors.White
  },

  cartsizerow: {
    padding: 18,
    marginHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.Border
  },
  cartsizerowtext: {
    fontSize: 16
  },
  cartsizerowselectedtext: {
    color: Colors.PrimaryBtn,
    fontWeight: "bold"
  },

  labelDisabled: {
    color: Colors.Disabled
  },

  cartbtnrow: {
    backgroundColor: Colors.White,
    height: 60
  },

  cartaddbtn: {
    margin: 10,
    backgroundColor: Colors.Disabled
  },

  cartaddbtntext: {
    color: Colors.White,
    fontWeight: "500"
  },

  cartaddbtnactive: {
    backgroundColor: Colors.PrimaryBtn
  },

  cartadddonetext: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    padding: 20
  },

  gotocartbtn: {
    margin: 10,
    backgroundColor: Colors.PrimaryBtn
  },
  continueshoppingbtn: {
    margin: 10,
    backgroundColor: Colors.SecondaryBtn
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: -7
  },
  emptyDot: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,.4)"
  },
  activeDot: {
    overflow: "hidden",
    backgroundColor: Colors.LightBlue
  }
})
export default styles
