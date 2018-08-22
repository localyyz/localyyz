import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";
import { toPriceString } from "localyyz/helpers";

// local
import ComponentWrapper from "../Summary";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    checkoutSummary: {
      cart: {
        items: [
          {
            id: 1,
            product: {
              title: "test",
              place: {
                imageUrl: "http://test.com/test.jpg"
              }
            },
            variant: {
              description: "test"
            },
            price: 1
          }
        ]
      },
      customerName: "test",
      email: "test@test.com",
      shippingDetails: {
        address: "test street",
        city: "test city",
        region: "test region",
        zip: "00000",
        country: "test country"
      },
      billingDetails: {
        address: "test street",
        city: "test city",
        region: "test region",
        zip: "00000",
        country: "test country"
      },
      shippingExpectation: "tomorrow",
      amountSubtotal: 1,
      amountShipping: 2,
      amountTaxes: 3,
      amountDiscount: 4,
      amountTotal: 5,
      paymentType: "cc-visa",
      paymentLastFour: "0000"
    },
    navigation: {
      getScreenProps: () => ({
        close: jest.fn(),
        navigate: jest.fn()
      })
    },
    loginWithFacebook: jest.fn(),
    hasSession: false,
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

  it("should render address fields", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "shippingAddress").children[0]).toBe(
      props.checkoutSummary.shippingDetails.address
    );
    expect(findById(layout, "shippingRegion").children[0]).toBe(
      `${props.checkoutSummary.shippingDetails.city}, ${
        props.checkoutSummary.shippingDetails.region
      } ${props.checkoutSummary.shippingDetails.zip}`
    );
    expect(findById(layout, "shippingCountry").children[0]).toBe(
      props.checkoutSummary.shippingDetails.country
    );
  });

  it("should show merchant logo", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "logo").props.source.uri).toBe(
      props.checkoutSummary.cart.items[0].product.place.imageUrl
    );
  });

  it("should show all items", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    for (let item of props.checkoutSummary.cart.items) {
      expect(findById(layout, `item-${item.id}`)).toBeDefined();
    }
  });

  it("should show totals", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "subtotal").children[0]).toBe(
      toPriceString(props.checkoutSummary.amountSubtotal)
    );
    expect(findById(layout, "taxes").children[0]).toBe(
      toPriceString(props.checkoutSummary.amountTaxes)
    );
    expect(findById(layout, "discount").children[0]).toBe(
      `(${toPriceString(props.checkoutSummary.amountDiscount)})`
    );
    expect(findById(layout, "shipping").children[0]).toBe(
      toPriceString(props.checkoutSummary.amountShipping)
    );
    expect(findById(layout, "total").children[0]).toBe(
      toPriceString(props.checkoutSummary.amountTotal)
    );
  });

  it("should show totals", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "payment").children[0]).toBe(
      props.checkoutSummary.paymentLastFour
    );
  });

  it("should not show discount if none", () => {
    let props = createProps();
    props = createProps({
      ...props,
      checkoutSummary: {
        ...props.checkoutSummary,
        amountDiscount: 0
      }
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "discount")).not.toBeDefined();
  });

  it("should show login nagging if not logged in", () => {
    let props = createProps({
      hasSession: false
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "existingUser")).not.toBeDefined();
    expect(findById(layout, "newUser")).toBeDefined();
  });

  it("should show login nagging if not logged in", () => {
    let props = createProps({
      hasSession: true
    });
    let c = renderWithLayout(<Component {...props} />);
    let layout = c.toJSON();

    expect(findById(layout, "existingUser")).toBeDefined();
    expect(findById(layout, "newUser")).not.toBeDefined();
  });
});
