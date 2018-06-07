import React from "react"
import CartHeader from "../components/CartHeader"
import renderer from "react-test-renderer"

describe("CartHeader", () => {
    it("CartHeader: should render properly", () => {
        let props: {
            icon: "3d-rotation"
        }
        let rendered = renderer.create(<CartHeader {...props}/>);
        expect(rendered).toMatchSnapshot()
    })
})