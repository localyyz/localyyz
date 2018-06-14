import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { FilterPopupButton as Component } from "../";

// constants
const NAME = "FilterPopupButton";
const PROPS = { text: "Filter", onPress: jest.fn() };

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
