import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { monogram } from "localyyz/assets";

// custom
import {
  ContentCoverSlider,
  InputField,
  PickerField,
  UppercasedText
} from "localyyz/components";
import { resetAction } from "localyyz/helpers";

// third party
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";
import EntypoIcon from "react-native-vector-icons/Entypo";

// constants
const BUSY_MESSAGE = "Hold on, I'm retrieving your account..";
const BUSY_REGISTER_MESSAGE = "Hold on, I'm setting up your new account..";
const GENDERS = {
  "": { label: "No preference" },
  male: { label: "Male fashion" },
  female: { label: "Female fashion" }
};

@inject("loginStore", "assistantStore")
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.assistant = this.props.assistantStore;
    this.state = {
      loginFailed: false,
      alertTitle: null,
      alertMessage: null,
      username: "",
      password: "",
      verifyPassword: "",
      name: "",
      gender: Object.keys(GENDERS)[0],
      isGenderVisible: false
    };

    // bindings
    this.renderRegisterForm = this.renderRegisterForm.bind(this);
    this.renderRegisterButton = this.renderRegisterButton.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.renderTos = this.renderTos.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.clearRegisterForm = this.clearRegisterForm.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
    this.toggleGenderPicker = this.toggleGenderPicker.bind(this);
  }

  componentDidMount() {
    const { navigation: { state } } = this.props;
    this.setState({
      appContext: state && state.params && state.params.appContext
    });
  }

  renderAlert() {
    return (
      <Animatable.View duration={200} ease="ease-out" animation="fadeInDown">
        <View style={[Styles.Card, styles.card, styles.alert]}>
          <Text style={styles.registerLabel}>
            <Text style={Styles.Emphasized}>
              {this.state.alertTitle && `${this.state.alertTitle} `}
            </Text>
            {this.state.alertMessage}
          </Text>
        </View>
      </Animatable.View>
    );
  }

  toggleGenderPicker(forceShow) {
    this.setState({
      isGenderVisible:
        forceShow !== null ? forceShow : !this.state.isGenderVisible
    });
  }

  renderGenderSwitch() {
    return (
      <View style={[Styles.Card, styles.card]}>
        <InputField
          ref="name"
          placeholder="Full name"
          autoCapitalize="words"
          onChangeText={name =>
            this.setState({
              name: name
            })
          }
          onSubmitEditing={() => this.toggleGenderPicker(true)}/>
        <PickerField
          onPress={() => this.toggleGenderPicker(true)}
          label="I'd prefer to see more of"
          options={GENDERS}
          selectedValue={this.state.gender}/>
      </View>
    );
  }

  onGenderChange(gender) {
    this.setState(
      {
        gender: gender
      },
      () => this.toggleGenderPicker(false)
    );
  }

  renderRegisterForm() {
    return (
      <Animatable.View animation="fadeInDown">
        <View style={[Styles.Card, styles.card]}>
          <InputField
            secureTextEntry
            clearTextOnFocus
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            placeholder="Re-enter your password"
            onChangeText={password =>
              this.setState({
                verifyPassword: password
              })
            }
            onSubmitEditing={() => this.refs.name.focus()}/>
        </View>
        {this.renderGenderSwitch()}
        {this.renderTos()}
        {this.renderRegisterButton()}
      </Animatable.View>
    );
  }

  renderRegisterButton() {
    return (
      <TouchableOpacity onPress={this.onRegister}>
        <View style={[Styles.RoundedButton, styles.button]}>
          <UppercasedText style={styles.buttonLabel}>
            Create a new account
          </UppercasedText>
        </View>
      </TouchableOpacity>
    );
  }

  renderLoginButton() {
    return (
      <View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.onFacebookLogin}>
            <View
              style={[
                Styles.RoundedButton,
                styles.button,
                styles.facebookButton
              ]}>
              <EntypoIcon
                name="facebook"
                color={Colours.AlternateText}
                size={Sizes.Text}/>
              <UppercasedText
                style={[styles.buttonLabel, styles.buttonLabelWithIcon]}>
                Sign in with Facebook
              </UppercasedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onLogin}>
            <View
              style={[Styles.RoundedButton, styles.button, styles.logInButton]}>
              <UppercasedText style={styles.buttonLabel}>
                Sign in
              </UppercasedText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[Styles.Card, styles.card, styles.tos]}>
          <Text style={styles.loginLabel}>
            {"We'll help create an account for you if you don't have one yet."}
          </Text>
        </View>
      </View>
    );
  }

  renderTos() {
    return (
      <View style={[Styles.Card, styles.card, styles.tos]}>
        <Text style={styles.tosLabel}>
          By proceeding to create a Localyyz account, you hereby acknowledge and
          accept both the Terms of Service Agreement and our Privacy Policy. You
          also consent to receive relevant communication that Localyyz and our
          merchants may send you via email from time to time.
        </Text>
      </View>
    );
  }

  clearRegisterForm() {
    this.setState({
      loginFailed: false,
      alertTitle: null,
      alertMessage: null
    });
  }

  onFacebookLogin() {
    this.fetchSession("facebook", null, true);
  }

  onLogin() {
    if (this.state.username.length < 1) {
      this.setState({
        alertTitle: "Email address cannot be blank.",
        alertMessage: "Please fill in your email address."
      });
    } else if (this.state.password.length < 8) {
      this.setState({
        alertTitle: "Minimum password length is 8 characters.",
        alertMessage: "Please use a longer password."
      });
    } else {
      this.assistant.write(BUSY_MESSAGE, null, true);
      this.fetchSession("email", {
        email: this.state.username,
        password: this.state.password
      });
    }
  }

  onRegister() {
    if (this.state.password.length < 8) {
      this.setState({
        alertTitle: "Minimum password length is 8 characters.",
        alertMessage: "Please use a longer password."
      });
    } else if (this.state.password !== this.state.verifyPassword) {
      this.setState({
        alertTitle: "Passwords do not match.",
        alertMessage:
          "Please retype matching passwords in both the password and verify fields above and below."
      });
    } else if (this.state.name.length < 2) {
      this.setState({
        alertTitle: "Please fill in your full name.",
        alertMessage:
          "We use your name to personalize your experience and to expedite shipping."
      });
    } else {
      this.assistant.write(BUSY_REGISTER_MESSAGE, null, true);
      this.register(
        this.state.username,
        this.state.password,
        this.state.name,
        this.state.gender
      );
    }
  }

  fetchSession = async (type, payload, skipRegister) => {
    const wasSuccessful = await this.props.loginStore.login(type, payload);

    // dismiss assistant
    this.assistant.get(BUSY_MESSAGE).cancel();
    if (wasSuccessful) {
      this.state.appContext
        ? this.props.navigation.goBack()
        : this.props.navigation.dispatch(resetAction("App"));
    } else {
      !skipRegister
        && this.setState({
          loginFailed: true,
          alertTitle:
            "We couldn't find an account with that username and password combination.",
          alertMessage:
            "You can create a new account below or try again with a different username and password combination."
        });
    }
  };

  register = async (email, password, name, gender) => {
    const wasSuccessful = await this.props.loginStore.signup({
      email: email,
      password: password,
      passwordConfirm: password,
      fullName: name,
      gender: gender || ""
    });

    // dismiss assistant
    this.assistant.get(BUSY_REGISTER_MESSAGE).cancel();
    if (wasSuccessful) {
      this.state.appContext
        ? this.props.navigation.goBack()
        : this.props.navigation.dispatch(resetAction("App"));
    } else {
      this.setState({
        alertTitle: "There was an issue creating your new account.",
        alertMessage: "Please try again later."
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          iconType="close"
          idleStatusBarStatus="light-content"
          backgroundHeight={Sizes.OuterFrame * 6}
          backAction={() => this.props.navigation.goBack()}
          background={
            <Image
              resizeMode="cover"
              style={styles.background}
              source={monogram}/>
          }>
          <ScrollView
            scrollEventThrottle={16}
            onScroll={e => this.refs.container.onScroll(e)}>
            <View style={styles.wrapper}>
              <View style={[styles.card, styles.header]}>
                <Text style={styles.title}>Sign in to Localyyz</Text>
              </View>
              <View style={[Styles.Card, styles.card]}>
                <InputField
                  ref="username"
                  autoFocus
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={username =>
                    this.setState(
                      {
                        username: username
                      },
                      this.clearRegisterForm
                    )
                  }
                  onSubmitEditing={() => this.refs.password.focus()}
                  placeholder="Email address"/>
                <InputField
                  ref="password"
                  secureTextEntry
                  clearTextOnFocus
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  onChangeText={password =>
                    this.setState(
                      { password: password },
                      this.clearRegisterForm
                    )
                  }
                  onSubmitEditing={this.onLogin}
                  placeholder="Password"/>
              </View>
              {this.state.alertTitle || this.state.alertMessage
                ? this.renderAlert()
                : null}
              {this.state.loginFailed
                ? this.renderRegisterForm()
                : this.renderLoginButton()}
            </View>
          </ScrollView>
        </ContentCoverSlider>
        {this.state.isGenderVisible && (
          <PickerField.Modal
            options={GENDERS}
            selectedValue={this.state.gender}
            onValueChange={this.onGenderChange}
            onDismiss={() => this.toggleGenderPicker(false)}/>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  card: {
    marginVertical: Sizes.InnerFrame / 3,
    marginHorizontal: Sizes.InnerFrame
  },

  header: {
    marginTop: Sizes.OuterFrame * 4
  },

  background: {
    height: Sizes.OuterFrame * 6
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SectionTitle,
    ...Styles.Alternate,
    marginHorizontal: Sizes.InnerFrame / 2
  },

  alert: {
    backgroundColor: Colours.Alert
  },

  tos: {
    backgroundColor: Colours.Transparent,
    paddingVertical: Sizes.InnerFrame / 2
  },

  registerLabel: {
    ...Styles.Text
  },

  tosLabel: {
    ...Styles.Text,
    ...Styles.TinyText,
    ...Styles.Center
  },

  loginLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Center
  },

  buttons: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center"
  },

  button: {
    alignSelf: "center"
  },

  logInButton: {
    backgroundColor: Colours.Accented
  },

  facebookButton: {
    backgroundColor: Colours.Facebook,
    marginRight: Sizes.InnerFrame / 2
  },

  buttonLabelWithIcon: {
    marginLeft: Sizes.InnerFrame / 2
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
