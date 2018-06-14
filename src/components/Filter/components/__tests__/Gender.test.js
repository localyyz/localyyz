import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Gender } from "../";
let Component = Gender.wrappedComponent;

// constants
const NAME = "Gender filter";
const PROPS = {
  gender: "man",
  setGenderFilter: jest.fn()
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
