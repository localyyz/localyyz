import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../";

// constants
const NAME = "Filter";
const PROPS = {};

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = renderWithLayout(<Component {...PROPS} />, null, true);

    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />, null, true)
    ).toMatchSnapshot();
  });
});
