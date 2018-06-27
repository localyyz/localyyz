import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import Gender from "../Gender";
let Component = Gender.wrappedComponent;

// constants
const NAME = "Gender filter";
const PROPS = {
  value: "man",
  label: "Man",
  setFilter: jest.fn()
};

describe(NAME, () => {
  it("should render properly", () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(c).toBeDefined();
  });

  it("should render isOpen properly", () => {
    let c = renderWithLayout(
      <Component {...PROPS} gender={PROPS.value} />
    ).getInstance();

    expect(c).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
