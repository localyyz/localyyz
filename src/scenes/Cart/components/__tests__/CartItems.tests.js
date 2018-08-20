import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../CartItems";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  items: [
    {
      id: "first",
      product: {
        associatedPhotos: [
          { imageUrl: "picture.gif", width: 100, height: 100 }
        ],
        title: "Roshe One",
        brand: "Nike",
        price: 100,
        previousPrice: 120
      },
      hasError: false,
      variant: {
        description: "Some shoes"
      }
    },
    {
      id: "second",
      product: {
        associatedPhotos: [
          { imageUrl: "picture.gif", width: 100, height: 100 }
        ],
        title: "Roshe One - Blue",
        brand: "Nike",
        price: 50,
        previousPrice: 60
      },
      hasError: true,
      variant: {
        description: "Some shoes"
      }
    }
  ],
  navigation: {}
};

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />, undefined, true);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should render all its cart items", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />, undefined, true);
    let layout = c.toJSON();

    expect(layout.props.data.length).toBe(2);
  });
});
