import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../";

// constants
const NAME = "Filter";
const PROPS = {
};

describe(NAME, () => {
  it("should render properly - search:false", () => {
    let c = renderWithLayout(<Component search={false} />, null, true);
    expect(c).toBeDefined();
  });

  it("should render properly - search:true", () => {
    let c = renderWithLayout(<Component search={true} />, null, true);
    expect(c).toBeDefined();
  });

  it("should render to snapshot - search:false", () => {
    expect(
      renderWithLayout(<Component search={false} />, null, true)
    ).toMatchSnapshot();
  });

  it("should render to snapshot - search:true", () => {
    expect(
      renderWithLayout(<Component search={true} />, null, true)
    ).toMatchSnapshot();
  });
});
