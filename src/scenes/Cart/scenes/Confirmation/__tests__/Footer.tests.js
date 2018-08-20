import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";
import { toPriceString } from "localyyz/helpers";

// local
import ComponentWrapper from "../Footer";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    navigation: {
      navigate: jest.fn()
    },
    isTesting: true,
    isProcessing: false,
    subtotal: 10,
    shipping: 20,
    taxes: 30,
    totalPrice: 40,
    totalDiscount: 50,
    toggleProcessing: jest.fn(),
    setNextReady: jest.fn(),
    completeCheckout: jest.fn().mockImplementation(() => ({})),
    completePayment: jest.fn().mockImplementation(() => ({})),
    setCheckoutError: jest.fn(),
    setPaymentError: jest.fn(),
    clearCart: jest.fn(),
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

  it("should display subtotal", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let node = findById(layout, "Subtotal");
    expect(node).toMatchSnapshot();
    expect(node.children[0]).toBe(toPriceString(props.subtotal));
  });

  it("should display shipping", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let node = findById(layout, "Shipping");
    expect(node).toMatchSnapshot();
    expect(node.children[0]).toBe(toPriceString(props.shipping));
  });

  it("should display taxes", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let node = findById(layout, "Taxes");
    expect(node).toMatchSnapshot();
    expect(node.children[0]).toBe(toPriceString(props.taxes));
  });

  it("should display total", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let node = findById(layout, "Total");
    expect(node).toMatchSnapshot();
    expect(node.children[0]).toBe(toPriceString(props.totalPrice));
  });

  it("should display discount", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let node = findById(layout, "You saved");
    expect(node).toMatchSnapshot();
    expect(node.children[0]).toBe(toPriceString(props.totalDiscount));
  });

  it("should not display taxes nor savings if values are 0", () => {
    let props = createProps({
      taxes: 0,
      totalDiscount: 0
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    let taxes = findById(layout, "Taxes");
    let discount = findById(layout, "You saved");

    expect(taxes).not.toBeDefined();
    expect(discount).not.toBeDefined();
  });

  // onComplete
  it("should attempt checkout", async () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect.assertions(1);
    await instance.onComplete();
    expect(props.completeCheckout).toBeCalled();
  });

  it("should attempt payment if checkout successful", async () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect.assertions(1);
    await instance.onComplete();
    expect(props.completePayment).toBeCalled();
  });

  it("should not try payment but log error if checkout failed", async () => {
    let props = createProps({
      completeCheckout: () => ({ error: "test" })
    });
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect.assertions(2);
    await instance.onComplete();
    expect(props.completePayment).not.toBeCalled();
    expect(props.setCheckoutError).toBeCalledWith(
      props.completeCheckout().error
    );
  });

  it("should proceed to receipt view if payment successful and clear cart", async () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect.assertions(2);
    await instance.onComplete();
    expect(props.clearCart).toBeCalled();
    expect(props.navigation.navigate.mock.calls[0][0]).toBe("SummaryScene");
  });

  it("should show error on payment failure", async () => {
    let props = createProps({
      completePayment: () => ({ error: "test" })
    });
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    expect.assertions(3);
    await instance.onComplete();
    expect(props.clearCart).not.toBeCalled();
    expect(props.navigation.navigate).not.toBeCalled();
    expect(props.setPaymentError).toBeCalledWith(props.completePayment().error);
  });
});
