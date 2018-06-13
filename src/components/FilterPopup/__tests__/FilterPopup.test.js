import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as FilterPopup } from "../";
let Component = FilterPopup.wrappedComponent;

// constants
const NAME = "FilterPopup";
const PROPS = { filterStore: {} };

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
