import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../";

// constants
const NAME = "Filter";
const PROPS = {};

describe(NAME, () => {
  it("should render properly", () => {
    let c = renderWithLayout(<Component {...PROPS} />, null, true);
    expect(c).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />, null, true)
    ).toMatchSnapshot();
  });
});
