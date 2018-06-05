import React from "react"
import {View, TouchableOpacity, StyleSheet, TextInput} from "react-native"
import { Colours, Sizes, Styles, DEFAULT_EMAIL} from "localyyz/constants";

import CartHeader from "./CartHeader";
import CartField from "./CartField";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { inject, observer, PropTypes as mobxPropTypes } from "mobx-react/native";
import * as Animatable from "react-native-animatable";
import { UppercasedText } from "localyyz/components";

@inject(stores => ({
    user: stores.userStore,
    cart: stores.cartStore
}))
@observer
export default class Email extends React.Component {
    
    static propTypes = {
        user: mobxPropTypes.observableObject.isRequired,
        cart: mobxPropTypes.observableObject.isRequired
    };

    constructor(props){
        super(props);
        this.state = {
            isComplete : this.props.user.email ? true : false,
            isSelecting : this.props.user.email ? false : true,
            email: this.props.user.email,           
            emailNew: "",
            validEmail: true
        };

        if (this.props.user.email) {
            this.props.cart.updateEmail(this.props.user.email)
        } else {
            this.props.cart.updateEmail(null)
        }
    }

    toggleSelect = () => {
        let selectingState = true;
        if (this.state.isSelecting) {
            selectingState = false;
        } 
        this.setState({
          isSelecting: selectingState
        });
    };

    verifyEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onEmailUpdate = (email) => {
        if(this.verifyEmail(email)){
            this.setState({ 
                isComplete: true,
                isSelecting: false,
                email: email,
                emailNew: email,
                validEmail: true
            });
            this.props.cart.updateEmail(email)
        }
        else {
            this.setState({
                validEmail: false
            })
            this.props.cart.updateEmail(null)
        }
        
    }

    get renderEmailForm() {
        return (
            <View style={styles.formContainer}>
                <Animatable.View
                animation="fadeInDown"
                duration={200}
                style={[Styles.Horizontal, Styles.EqualColumns]}>
                    <CartField
                    icon="email"
                    label="Email"
                    color = {this.state.validEmail ? Colours.EmphasizedText : Colours.Fail} >
                        <TextInput
                        ref="name"
                        autoCorrect={false}
                        autoCapitalize = "none"
                        placeholder={DEFAULT_EMAIL}
                        placeholderTextColor={Colours.SubduedText}
                        value = {this.state.emailNew}
                        onChangeText = { email => this.setState({emailNew: email})}
                        style={[
                            Styles.Input,
                        ]}/>
                    </CartField>
                </Animatable.View>
                <TouchableOpacity style={styles.addAddress} onPress={() => this.onEmailUpdate(this.state.emailNew)}>
                    <View style={Styles.RoundedButton}>
                        <UppercasedText style={styles.addButtonLabel}>
                        use this email
                        </UppercasedText>
                    </View>
                </TouchableOpacity>
            </View>
        )
      }

    render(){
        return (
            <View style={styles.container}>
              <TouchableOpacity onPress={() => this.toggleSelect()}>
                <CartHeader
                  title="Email"
                  icon={
                    this.state.isComplete ? (
                    <FontAwesomeIcon
                        name="check-circle"
                        size={Sizes.IconButton / 2}
                        color={Colours.PositiveButton}
                        style={Styles.IconOffset}/>
                    ) : (
                    <EntypoIcon
                      name="dot-single"
                      size={Sizes.IconButton}
                      color={Colours.NegativeButton}/>
                  )
                }>
                    {
                        this.state.isComplete ? (
                            this.state.email
                        ) : (
                            "no email selected"
                        )
                    }
                </CartHeader>
              </TouchableOpacity>
              {this.state.isSelecting ? this.renderEmailForm : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    formContainer: {
        paddingVertical: Sizes.InnerFrame,
        backgroundColor: Colours.Foreground
    },
    addAddress: {
        marginHorizontal: Sizes.InnerFrame,
        marginVertical: Sizes.InnerFrame,
        alignItems: "flex-start"
    },
    addButtonLabel: {
        ...Styles.Text,
        ...Styles.Emphasized,
        ...Styles.Alternate
    }
  });