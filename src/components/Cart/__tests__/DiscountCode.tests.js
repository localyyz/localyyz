import React from "react";
import DiscountCode from "../components/DiscountCode";
import Renderer from "react-test-renderer";

const props = {
  applyDiscountCode: ({ discountCode }) => {
    if (discountCode == "SAMPLEDISCOUNT") {
      return true;
    } else {
      return false;
    }
  },
  updateDiscountCodeInStore: jest.fn()
};
describe("DiscountCode", () => {
  it("DiscountCode: should be able to enter valid discount code", () => {
    let rendered = Renderer.create(
      <DiscountCode.wrappedComponent {...props} />
    ).getInstance();
    rendered.toggleDiscountForm();
    rendered.updateDiscountCode("SAMPLEDISCOUNT");
    expect(rendered.state.newDiscountCode).toBe("SAMPLEDISCOUNT");
    expect(rendered.state.isVerified).toBe(false);
    expect(rendered.state.isOpen).toBe(true);
    rendered.verifyDiscountCode();
    expect(rendered.state.discountCode).toBe("SAMPLEDISCOUNT");
    expect(rendered.state.isVerified).toBe(true);
    expect(rendered.state.isOpen).toBe(false);
    expect(props.updateDiscountCodeInStore).toHaveBeenCalledTimes(1);
    expect(rendered.refs.verifyDiscountIcon.props.icon.props.name).toBe(
      "check-circle"
    );
  });

  it("DiscountCode: should not be able enter discount codes where server returns false", () => {
    let rendered = Renderer.create(
      <DiscountCode.wrappedComponent {...props} />
    ).getInstance();
    rendered.toggleDiscountForm();
    rendered.updateDiscountCode("BADDISCOUNT");
    rendered.verifyDiscountCode();
    expect(rendered.state.discountCode).toBe("");
    expect(rendered.state.isVerified).toBe(false);
    expect(rendered.state.isOpen).toBe(true);
    expect(rendered.refs.verifyDiscountIcon.props.icon.props.name).toBe(
      "dot-single"
    );
  });

  it("DiscountCode: should be able to clear discount code", () => {
    let rendered = Renderer.create(
      <DiscountCode.wrappedComponent {...props} />
    ).getInstance();
    rendered.toggleDiscountForm();
    rendered.updateDiscountCode("SAMPLEDISCOUNT");
    expect(rendered.state.newDiscountCode).toBe("SAMPLEDISCOUNT");
    expect(rendered.state.isVerified).toBe(false);
    expect(rendered.state.isOpen).toBe(true);
    rendered.verifyDiscountCode();
    expect(rendered.state.discountCode).toBe("SAMPLEDISCOUNT");
    expect(rendered.state.isVerified).toBe(true);
    expect(rendered.state.isOpen).toBe(false);
    expect(rendered.refs.verifyDiscountIcon.props.icon.props.name).toBe(
      "check-circle"
    );
    rendered.toggleDiscountForm();
    rendered.updateDiscountCode("");
    rendered.verifyDiscountCode();
    expect(rendered.state.discountCode).toBe("");
    expect(rendered.state.isVerified).toBe(false);
    expect(rendered.state.isOpen).toBe(true);
    expect(rendered.refs.verifyDiscountIcon.props.icon.props.name).toBe(
      "dot-single"
    );
  });

  it("Discount Code: snapshot regression test", () => {
    let rendered = Renderer.create(
      <DiscountCode.wrappedComponent {...props} />
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
