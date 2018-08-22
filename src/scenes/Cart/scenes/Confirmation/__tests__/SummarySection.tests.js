import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../SummarySection";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    shippingAddress: {
      hasError: false
    },
    navigation: {
      getScreenProps: () => ({
        close: jest.fn()
      }),
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

  it("should navigate properly", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    // call all navigate methods
    instance.updateEmail();
    instance.updateShipping();
    instance.updatePayment();

    // expects
    expect(props.navigation.navigate.mock.calls[0][0]).toBe("EmailScene");
    expect(props.navigation.navigate.mock.calls[1][0]).toBe("ShippingScene");
    expect(props.navigation.navigate.mock.calls[2][0]).toBe("PaymentScene");
  });

  it("should display email", () => {
    let props = createProps({
      email: "test@test.com"
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    // expects
    expect(findById(layout, "emailValue").children[0]).toBe(props.email);
    expect(layout).toMatchSnapshot();
  });

  it("should display address", () => {
    let props = createProps({
      shippingAddress: {
        address: "test"
      }
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    // expects
    expect(findById(layout, "shippingValue").children[0]).toBe(
      props.shippingAddress.address
    );
    expect(layout).toMatchSnapshot();
  });

  it("should display payment", () => {
    let props = createProps({
      payment: "0000"
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    // expects
    expect(findById(layout, "paymentValue").children[0]).toBe(
      `Ending in ${props.payment}`
    );
    expect(layout).toMatchSnapshot();
  });
});
