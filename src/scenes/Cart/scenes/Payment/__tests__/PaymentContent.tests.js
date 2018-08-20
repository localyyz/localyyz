import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../content";
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

  // test validators
  it("should validate valid card", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateNumberValid("4242 4242 4242 4242")).toBe(true);
    expect(instance.validateNumberValid("4242424242424242")).toBe(true);
  });

  it("should validate invalid card", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateNumberValid("4242 4242 4242 4244")).not.toBe(true);
    expect(instance.validateNumberValid("4242424242424244")).not.toBe(true);
    expect(instance.validateNumberValid("42424242424242")).not.toBe(true);
    expect(instance.validateNumberValid("424242424242424242")).not.toBe(true);
  });

  it("should validate valid expiry format", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateExpiryWellFormatted("01/01")).toBe(true);
    expect(instance.validateExpiryWellFormatted("12/99")).toBe(true);
  });

  it("should validate invalid expiry format", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateExpiryWellFormatted("13/01")).not.toBe(true);
    expect(instance.validateExpiryWellFormatted("5/99")).not.toBe(true);
    expect(instance.validateExpiryWellFormatted("1199")).not.toBe(true);
  });

  it("should validate valid cvc", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateCvcValid("111")).toBe(true);
  });

  it("should validate invalid cvc", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.validateCvcValid("11")).not.toBe(true);
    expect(instance.validateCvcValid("1111")).not.toBe(true);
    expect(instance.validateCvcValid("xxx")).not.toBe(true);
  });

  // test masks
  it("should properly mask card", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.maskCardSpaces("11111")).toBe("1111 1");
    expect(instance.maskCardSpaces("111111111")).toBe("1111 1111 1");
    expect(instance.maskCardSpaces("1111111111111")).toBe("1111 1111 1111 1");
    expect(instance.maskCardSpaces("1111111111111111")).toBe(
      "1111 1111 1111 1111"
    );
  });

  it("should properly mask expiry", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect(instance.maskExpirySlashes("11")).toBe("11");
    expect(instance.maskExpirySlashes("111")).toBe("11/1");
    expect(instance.maskExpirySlashes("1111")).toBe("11/11");
    expect(instance.maskExpirySlashes("11111")).toBe("11/11/1");
  });

  it("should show next button on complete card", () => {
    let props = createProps({
      card: {
        isComplete: true,
        number: "4242 4242 4242 4242",
        expiryMonth: "11",
        expiryYear: "99",
        cvc: "999"
      }
    });
    let c = renderWithLayout(<Component {...props} />, undefined, true);
    let layout = c.toJSON();

    expect(findById(layout, "next")).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should not show next button on incomplete card", () => {
    let props = createProps({
      card: {
        isComplete: false,
        number: "4242 4242 4242 4242",
        expiryMonth: "11",
        expiryYear: "99"
      }
    });
    let c = renderWithLayout(<Component {...props} />, undefined, true);
    let layout = c.toJSON();

    expect(findById(layout, "next")).not.toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should prompt address selection for billing", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    // call changeBilling like onPress
    instance.changeBilling();

    expect(props.navigation.navigate.mock.calls[0][0]).toBe("Addresses");
  });
});
