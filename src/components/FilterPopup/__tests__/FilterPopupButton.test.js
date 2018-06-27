import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Button as Component } from "../Button";

// constants
const NAME = "FilterPopupButton";
const PROPS = {
  text: "Filter",
  onPress: jest.fn()
};

describe(NAME, () => {
  it("should render properly", () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();
    expect(c).toBeDefined();
    expect(PROPS.onPress).not.toBeCalled();
  });

  it("should open modal if isInitialVisible", () => {
    let fn = jest.fn();
    let c = renderWithLayout(
      <Component {...PROPS} isInitialVisible onPress={fn} />
    ).getInstance();
    expect(c).toBeDefined();
    expect(fn).toBeCalled();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
