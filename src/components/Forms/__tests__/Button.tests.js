import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import Button from "../components/Button";

// constants
const NAME = "Button test - form";
const PROPS = {
  children: "sample children",
  onPress: jest.fn(),
  color: "green",
  labelColor: "red"
};
const Component = Button.wrappedComponent;

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();
    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should render to snapshot: isDisabled() => false`, () => {
    PROPS.isEnabled = true;
    PROPS.isDisabled = true;
    PROPS.isComplete = true;
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });

  it(`${NAME}: should render to snapshot: isDisabled() => true`, () => {
    PROPS.isEnabled = false;
    PROPS.isDisabled = true;
    PROPS.isComplete = true;
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
