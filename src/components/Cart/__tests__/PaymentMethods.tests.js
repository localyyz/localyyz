import React from "react"
import PaymentMethod from "../components/PaymentMethods"
import Renderer from "react-test-renderer"
import Colours from "../../../constants/colours"

const props = {
    cartStore:{
        paymentDetails: {},
        usePaymentMethod: () => {}
    },
    cartUiStore: {
        isPaymentVisible: true,
        togglePayment: () => {},
        getCheckoutSummary: () => {}
    },
    toggle: () => {}
}

describe("Payment Methods", () => {

    it("Payment Methods: should render properly", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).toJSON()
        expect(rendered).toMatchSnapshot()
    })

    it("Payment Methods: should be able to enter a valid credit card", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onCardUpdate("4242424242424242")
        rendered.onBlur("card", !rendered.isCardValid("4242424242424242"))
        expect(rendered.state.number).toBe("4242 4242 4242 4242")
        expect(rendered.state.numberValid).toBe(true)
        expect(rendered.state.isCardInvalid).toBe(null)
        expect(rendered.refs.number.props.value).toBe("4242 4242 4242 4242")
        expect(rendered.refs.number.props.style[0].color).toBe(Colours.EmphasizedText)
    })

    it("Payment Methods: should not be able to enter an invalid credit card", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onCardUpdate("123")
        rendered.onBlur("card", !rendered.isCardValid("123"))
        expect(rendered.state.number).toBe("123")
        expect(rendered.state.numberValid).toBe(false)
        expect(rendered.state.isCardInvalid).toBe(null)
        expect(rendered.refs.number.props.value).toBe("123") 
        expect(rendered.refs.number.props.style[1].color).toBe(Colours.Fail)
    })

    it("Payment Methods: should be able to enter a valid expiry", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onExpiryUpdate("12/20")
        rendered.onBlur("expiry", !rendered.isExpiryValid("12/20"))
        expect(rendered.state.expiry).toBe("12/20")
        expect(rendered.state.expiryMonth).toBe("12")
        expect(rendered.state.expiryYear).toBe("20")
        expect(rendered.state.expiryValid).toBe(true)
        expect(rendered.refs.expiry.props.value).toBe("12/20")
        expect(rendered.refs.expiry.props.style[0].color).toBe(Colours.EmphasizedText)
    })

    it("Payment Methods: should not be able to enter an invalid expiry", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onExpiryUpdate("00/00")
        rendered.onBlur("expiry", !rendered.isExpiryValid("00/00"))
        expect(rendered.state.expiry).toBe("00/00")
        expect(rendered.state.expiryMonth).toBe("00")
        expect(rendered.state.expiryYear).toBe("00")
        expect(rendered.state.expiryValid).toBe(false)
        expect(rendered.refs.expiry.props.value).toBe("00/00")
        expect(rendered.refs.expiry.props.style[1].color).toBe(Colours.Fail)
    })
    
    it("Payment Methods: should be able to enter a valid cvc", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onCvcUpdate("123")
        rendered.onBlur("cvc", !rendered.isCvcValid("123"))
        expect(rendered.state.cvc).toBe("123")
        expect(rendered.state.cvcValid).toBe(true)
        expect(rendered.refs.cvc.props.value).toBe("123")
        expect(rendered.refs.cvc.props.style[0].color).toBe(Colours.EmphasizedText)
    })

    it("Payment Methods: should not be able to enter an invalid cvc", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onCvcUpdate("12")
        rendered.onBlur("cvc", !rendered.isCvcValid("12"))
        expect(rendered.state.cvc).toBe("12")
        expect(rendered.state.cvcValid).toBe(false)
        expect(rendered.refs.cvc.props.value).toBe("12")
        expect(rendered.refs.cvc.props.style[1].color).toBe(Colours.Fail)
    })

    it("Payment Methods: should be able to a valid card holder name", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onNameUpdate("Johnny Appleseed")
        rendered.onBlur("name", !rendered.isNameValid("Johnny Appleseed"))
        expect(rendered.state.name).toBe("Johnny Appleseed")
        expect(rendered.state.nameValid).toBe(true)
        expect(rendered.state.isNameInvalid).toBe(null)
        expect(rendered.refs.name.props.value).toBe("Johnny Appleseed")
        expect(rendered.refs.name.props.style[0].color).toBe(Colours.EmphasizedText)
    })

    it("Payment Methods: should be able to enter an invalid card holder name", () => {
        let rendered = Renderer.create(<PaymentMethod {...props}/>).getInstance().wrappedInstance
        rendered.onNameUpdate("Johnny")
        rendered.onBlur("name", !rendered.isNameValid("Johnny"))
        expect(rendered.state.name).toBe("Johnny")
        expect(rendered.state.nameValid).toBe(false)
        expect(rendered.state.isNameInvalid).toBe(null)
        expect(rendered.refs.name.props.value).toBe("Johnny")
        expect(rendered.refs.name.props.style[1].color).toBe(Colours.Fail)
    })

    it("Payment Methods: should be able to use a card if all entries are valid", () => {
        const propsLocal = {
            cartStore:{
                paymentDetails: {
                    number: "4242424242424242",
                    expiry: "12/20",
                    cvc: "230",
                    name: "Johnny Appleseed"
                },
                usePaymentMethod: () => {}
            },
            cartUiStore: {
                isPaymentVisible: true,
                togglePayment: () => {},
                getCheckoutSummary: () => {}
            },
        }
        let rendered = Renderer.create(<PaymentMethod {...propsLocal}/>).getInstance().wrappedInstance
        rendered.onSubmit()
        expect(rendered.refs.paymentIcon.props.icon.props.name).toBe("check-circle")
    })

    it("Payment Methods: should not be able to use a card if an entry is wrong", () => {
        const propsLocal = {
            cartStore:{
                paymentDetails: {
                    number: "4242424242424242",
                    expiry: "12/00",
                    cvc: "23",
                    name: "Johnny Appleseed"
                },
                usePaymentMethod: () => {}
            },
            cartUiStore: {
                isPaymentVisible: true,
                togglePayment: () => {},
                getCheckoutSummary: () => {}
            },
        }
        let rendered = Renderer.create(<PaymentMethod {...propsLocal}/>).getInstance().wrappedInstance
        rendered.onSubmit()
        expect(rendered.refs.paymentIcon.props.icon.props.name).toBe("dot-single")
    })

})