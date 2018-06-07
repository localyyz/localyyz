import React from "react"
import {CartItem} from "../components/CartItem"
import renderer from "react-test-renderer"

const props = {
    cartUiStore: {
        seeFullScreenPullup: () => {},
        setItemSizeType: () => {},
        togglePullup: () => {}
    },
    cartStore: {
        removeItem: () => {},
        checkoutWithReject: () => {},
        cart: []
    },
    assistantStore: {
        write: () => {},
        get: () => {}
    },
    item: {
        product: {
            title: "Sample Product",
            imageUrl: "www.google.com"
        },
        price: 21.33,
        variant: {
            etc : {
                size: "XL",
                color: "green"
            }
        },
        hasError: false

    }
}
describe("CartItem", () => {
    
    it("CartItems: should render cart items properly(small)", () => {
        let propsLocal = props
        propsLocal.isSmall = true
        let rendered = renderer.create(<CartItem {...props}/>).getInstance().wrappedInstance
        expect(rendered.refs.image.props.source.uri).toBe("www.google.com")
        expect(rendered.refs.price.props.children).toBe("$21.33")
    })

    it("CartItems: should render cart items properly(large)", () => {
        let propsLocal = props
        propsLocal.isLarge = true
        let rendered = renderer.create(<CartItem {...props}/>).getInstance().wrappedInstance
        expect(rendered.refs.image.props.source.uri).toBe("www.google.com")
        expect(rendered.refs.variant.props.children[0].props.children).toBe("XL — green")
        expect(rendered.refs.truncatedTitle.props.children).toBe("Sample Product")
        expect(rendered.refs.price.props.children).toBe("$21.33")
    })

    it("CartItems: should render cart items properly(small) snapshot", () => {
        let propsLocal = props
        propsLocal.isSmall = true
        let rendered = renderer.create(<CartItem {...props}/>).toJSON()
        expect(rendered).toMatchSnapshot()
    })

    it("CartItems: should render cart items properly(large) snapshot", () => {
        let propsLocal = props
        propsLocal.isLarge = true
        let rendered = renderer.create(<CartItem {...props}/>).toJSON()
        expect(rendered).toMatchSnapshot()
    })

})