import React from "react"
import Address from "../components/Address" 
import Renderer from "react-test-renderer"

const props = {
    addressLine: "Localyyz",
    address: {
        shortAddress : "180 John Street",
        extendedAddress : "Toronto, Ontario, Canada"
    },
    buttonIcon: "air",
    buttonColor: "#000000"
}
describe("Address", () => {
    it("Address: should render properly", () => {
        let rendered = Renderer.create(<Address {...props}/>).getInstance()
        expect(rendered.refs.address.props.children[0].props.children).toBe("180 John Street")
        expect(rendered.refs.address.props.children[1].props.children).toBe("Toronto, Ontario, Canada")
        expect(rendered.refs.addressIcon.props.name).toBe("air")
        expect(rendered.refs.addressIcon.props.color).toBe("#000000")
    })

    it("Address: should render properly(snapshot)", () => {
        let rendered = Renderer.create(<Address {...props}/>).toJSON()
        expect(rendered).toMatchSnapshot()
    })
})