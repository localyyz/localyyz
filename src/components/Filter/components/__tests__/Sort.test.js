import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Sort } from "../";
let Component = Sort.wrappedComponent;

// constants
const NAME = "Sort";
const PROPS = {
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
