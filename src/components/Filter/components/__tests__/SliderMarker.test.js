import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as Component } from "../SliderMarker";

// constants
const NAME = "Filter slider marker";
const PROPS = {
  currentValue: 0.5,
  type: "discount"
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
