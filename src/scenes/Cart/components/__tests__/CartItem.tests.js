import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";
import { toPriceString } from "localyyz/helpers";

// local
import ComponentWrapper from "../CartItem";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  item: {
    product: {
      associatedPhotos: [{ imageUrl: "picture.gif", width: 100, height: 100 }],
      title: "Roshe One",
      brand: "Nike",
      price: 100,
      previousPrice: 120
    },
    hasError: false,
    variant: {
      description: "Some shoes"
    },
    price: 100
  },
  removeItem: jest.fn(),
  navigation: {}
};

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should render price properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "price").children[0]).toBe(
      toPriceString(DEFAULT_PROPS.item.price)
    );
  });

  it("should render prev price properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "previousPrice").children[0]).toBe(
      toPriceString(DEFAULT_PROPS.item.product.previousPrice)
    );
  });

  it("should render title properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "title").children[0]).toBe(
      DEFAULT_PROPS.item.product.title
    );
  });

  it("should render brand properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "brand").children[0]).toBe(
      DEFAULT_PROPS.item.product.brand
    );
  });

  it("should not show error", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "hasError")).not.toBeDefined();
  });

  it("should render photo properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "photo").props.source.uri).toBe(
      DEFAULT_PROPS.item.product.associatedPhotos[0].imageUrl
    );
  });

  it("should render variant info properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "variant").children[0]).toBe(
      DEFAULT_PROPS.item.variant.description
    );
  });

  it("should not show previous price if not on sale", () => {
    let MODIFIED_PROPS = DEFAULT_PROPS;
    MODIFIED_PROPS.item.product.previousPrice = 0;

    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "previousPrice")).not.toBeDefined();
  });

  it("should show OOS if hasError", () => {
    let MODIFIED_PROPS = DEFAULT_PROPS;
    MODIFIED_PROPS.item.hasError = true;

    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "hasError")).toBeDefined();
  });
});
