import React from "react"
import CartField from "../components/CartField"
import renderer from "react-test-renderer"

describe("CartField", () => {
    it("CartField: should render properly", () => {
        let props = {
            icon: "3d-rotation",
            label: "label",
        }
        const rendered = renderer.create(<CartField {...props}/>)
        expect(rendered).toMatchSnapshot()
    })
})