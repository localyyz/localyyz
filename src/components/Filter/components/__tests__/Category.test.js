import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Category } from "../Category";

// constants
const NAME = "Single category filter";
const PROPS = {
  title: "Category",
  fetchPath: "test"
};
const Component = Category.wrappedComponent;

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
