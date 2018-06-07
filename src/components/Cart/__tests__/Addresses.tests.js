import React from "react"
import Addresses from "../components/Addresses"
import Renderer from "react-test-renderer"

describe("Addresses", () => {

    it("Addresses: should render properly", () => {
        let props = {
            title: "Sample Address",
            addressStore : {
                addresses: [],
                fetch: () => {},
            }, 
            cartStore: {
                removeAddress: () => {},
                updateAddress: () => {}
            },
        }
        let rendered = Renderer.create(<Addresses {...props}/>).getInstance().wrappedInstance
        expect(rendered.refs.header.props.title).toBe("Sample Address")
        expect(rendered.refs.header.props.icon.props.name).toBe("dot-single")
        expect(rendered.refs.header.props.children).toBe("no address selected")
    })
})