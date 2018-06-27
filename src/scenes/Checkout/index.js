// third party
import { StackNavigator } from "react-navigation";

// custom
import { Payment } from "./scenes";

const CheckoutNavigator = StackNavigator(
  {
    Payment: { screen: Payment }
  },
  {
    initialRouteName: "Payment",
    navigationOptions: ({ navigation: { state } }) => ({
      header: null,
      gesturesEnabled: state.params && state.params.gesturesEnabled
    })
  }
);

export default CheckoutNavigator;
