import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../SortBy";

// constants
const NAME = "Sort by (option)";
const PROPS = {
  label: "Test",
  value: "test",
  sortBy: "test",
  setSortBy: jest.fn()
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
