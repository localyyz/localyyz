import React from "react"
import CartHeaderSummary from "../components/CartHeaderSummary"
import Renderer from "react-test-renderer"

const props = {
    cartStore : {
        numItems: 5,
        amountTotal: 55.233
    },
    cartUiStore: {
        toggleItems: () => {}
    }
}
describe("CartHeaderSummary", () => {
    it("CartHeaderSummary: should render properly", () => {
        let rendered = Renderer.create(<CartHeaderSummary {...props} />)
        expect(rendered.toJSON()).toMatchSnapshot()
    })
    it("CartHeaderSummary: should display items and amount correctly", ()=>{
        let rendered = Renderer.create(<CartHeaderSummary {...props} />).getInstance().wrappedInstance
        expect(rendered.refs.cart.props.children[1].props.children).toBe("5 items — total $55.23")
    })
})