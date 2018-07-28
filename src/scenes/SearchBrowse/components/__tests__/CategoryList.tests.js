import React from "react";
import Renderer from "react-test-renderer";

import CategoryList from "../CategoryList";

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
  fetch: jest.fn(),
  categories: CATEGORIES
};

describe("CategoryList", () => {
  it("should render properly", () => {
    let render = Renderer.create(
      <CategoryList.wrappedComponent {...DEFAULT_PROPS} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });

  it("should render category properly", () => {
    let render = Renderer.create(
      <CategoryList.wrappedComponent {...DEFAULT_PROPS} />
    ).getInstance();

    expect(render.renderCategory({ item: CATEGORIES[0] })).toMatchSnapshot();
  });

  it("should render subcategory properly", () => {
    let render = Renderer.create(
      <CategoryList.wrappedComponent {...DEFAULT_PROPS} />
    ).getInstance();

    expect(
      render.renderCategory({ item: CATEGORIES[0].values[0] })
    ).toMatchSnapshot();
  });

  it("should build params properly", () => {
    let render = Renderer.create(
      <CategoryList.wrappedComponent {...DEFAULT_PROPS} />
    ).getInstance();

    expect(
      render.buildParams({
        ...CATEGORIES[0].values[0],
        parentId: CATEGORIES[0].values[0].id
      })
    ).toMatchSnapshot();
  });
});
