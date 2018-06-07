import React from "react"
import CartSummary from "../components/CartSummary"
import renderer from "react-test-renderer";

const props = {
  cartStore : {
    amountSubtotal : 25.234,
    amountDiscount : 5.225,
    amountShipping: 3.233,
    amountTaxes : 5.999,
    amountTotal : 28.21
   }
};

describe("CartSummary", () => {

  it("Cart Summary: should render correctly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it("Cart Summary: should display subtotal properly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).getInstance().wrappedInstance
    expect(rendered.refs.subTotal.props.children).toBe("$25.23")
  })

  it("Cart Summary: should display discount properly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).getInstance().wrappedInstance
    expect(rendered.refs.discount.props.children).toBe("($5.22)")
  })

  it("Cart Summary: should display shipping properly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).getInstance().wrappedInstance
    expect(rendered.refs.shipping.props.children).toBe("$3.23")
  })

  it("Cart Summary: should display taxes properly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).getInstance().wrappedInstance
    expect(rendered.refs.tax.props.children).toBe("$6.00")
  })

  it("Cart Summary: should display shipping properly", () => {
    let rendered = renderer.create(<CartSummary {...props} />).getInstance().wrappedInstance
    expect(rendered.refs.grandTotal.props.children).toBe("$28.21")
  })
  
})
