import React from "react";
import Renderer from "react-test-renderer";

import CategoryBar, { CategoryBarItem } from "../CategoryBar";

const CATEGORIES = [
  {
    id: "apparel",
    type: "apparel",
    title: "Apparel",
    values: [
      {
        id: "activewear",
        type: "activewear",
        title: "Activewear",
        values: [],
        imageUrl:
          "https://cdn.shopify.com/s/files/1/1825/3189/products/1589d1c85bfdd70a943bbcc2c75374d6.jpg"
      }
    ]
  }
];

const DEFAULT_PROPS = {
  id: "apparel",
  store: {
    categories: CATEGORIES
  }
};

describe("CategoryBar", () => {
  it("should render properly", () => {
    let render = Renderer.create(<CategoryBar {...DEFAULT_PROPS} />);
    expect(render.toJSON()).toMatchSnapshot();
  });
});

describe("CategoryBarItem", () => {
  it("should render properly", () => {
    let render = Renderer.create(
      <CategoryBarItem.wrappedComponent {...CATEGORIES[0].values[0]} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });
});
