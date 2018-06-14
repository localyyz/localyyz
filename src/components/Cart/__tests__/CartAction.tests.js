import React from "react"
import { CartAction } from "../components/CartAction"
import Renderer from "react-test-renderer"

const props = {
    cartStore: {
        checkoutWithReject: jest.fn()
    },
    cartUiStore: {
        validate: jest.fn(),
        getCheckoutSummary: jest.fn()
    },
    navigation: {
        navigate: jest.fn()
    }
}

describe("Cart Action", () => {
    it("Cart Action: checkout button should finish onCheckout with errors", async () => {
        let rendered = Renderer.create(<CartAction {...props}/>).getInstance().wrappedInstance
        rendered.onCheckout()
        expect(props.cartUiStore.validate).toHaveBeenCalledTimes(1);
        await expect(props.cartStore.checkoutWithReject).toHaveBeenCalledTimes(1);
        expect(props.navigation.navigate).toHaveBeenCalledTimes(1);
        expect(props.cartUiStore.getCheckoutSummary).toHaveBeenCalledTimes(1);
    })
})