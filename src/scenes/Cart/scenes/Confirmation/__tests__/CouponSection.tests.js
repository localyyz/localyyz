import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../CouponSection";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    navigation: {
      navigate: jest.fn()
    },
    ...extra
  };
}

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should render applied coupon code", () => {
    let props = createProps({
      discountCode: "test"
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "couponLabel").children[0]).toBe(
      props.discountCode
    );
  });

  it("should navigate to DiscountScene", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    // call addCoupon
    instance.addCoupon();

    expect(props.navigation.navigate).toBeCalledWith("DiscountScene");
  });
});
