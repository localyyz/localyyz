import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../Category";

// constants
const NAME = "Single category filter";
const PROPS = {
  title: "Category",
  fetchPath: "test"
};

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
