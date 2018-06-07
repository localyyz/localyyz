import React from "react"
import { CartAction } from "../components/CartAction"
import Renderer from "react-test-renderer"

const props = {
    cartStore: {
        checkoutWithReject: () => {}
    },
    cartUiStore: {
        validate: () => {},
        getCheckoutSummary: () => {}
    },
    navigation: {}
}

describe("Cart Action", () => {
    it("Cart Action: checkout button should be clickable", () => {
        const mockFunction = jest.fn()
        let rendered = Renderer.create(<CartAction {...props}/>).getInstance().wrappedInstance
        rendered.onCheckout(mockFunction)
        expect(mockFunction).toHaveBeenCalledTimes(1)
    })
})