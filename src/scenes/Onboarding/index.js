// third party
import { createStackNavigator } from "react-navigation";

// local
import OnboardingScene from "./onboarding";
import PersonalizeScene from "./personalize";

const OnboardingStack = createStackNavigator(
  {
    Onboard: { screen: OnboardingScene },
    Personalize: { screen: PersonalizeScene }
  },
  {
    mode: "modal",
    initialRouteName: "Onboard",
    navigationOptions: ({ navigation }) => ({
      ...navigation.navigationOptions,
      header: null
    })
  }
);

export default OnboardingStack;
