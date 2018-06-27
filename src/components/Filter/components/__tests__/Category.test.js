import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Category } from "../Category";

// constants
const NAME = "Single category filter";
const PROPS = {
  title: "Apparel",
  value: "apparel",
  setCategoryFilter: jest.fn()
};
const Component = Category.wrappedComponent;

describe(NAME, () => {
  it("should render properly", () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();
    expect(c).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
