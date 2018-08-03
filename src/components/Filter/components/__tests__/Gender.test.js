import React from "react";

// third party
import Renderer from "react-test-renderer";

// local
import Gender from "../Gender";
let Component = Gender.wrappedComponent;

// constants
const NAME = "Gender filter";
const PROPS = {};

describe(NAME, () => {
  it("should render properly", () => {
    let c = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(c).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(
      Renderer.create(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });

  it("should toggle to man from unset", () => {
    let setFilter = jest.fn();
    let c = Renderer.create(
      <Component {...PROPS} setFilter={setFilter} />
    ).getInstance();

    // toggle the button
    c.onPress();
    expect(setFilter.mock.calls[0][0]).toEqual("man");
  });

  it("should toggle to woman from man", () => {
    let setFilter = jest.fn();
    let c = Renderer.create(
      <Component {...PROPS} gender="man" setFilter={setFilter} />
    ).getInstance();

    // toggle the button
    c.onPress();
    expect(setFilter.mock.calls[0][0]).toEqual("woman");
  });

  it("should unset from woman", () => {
    let setFilter = jest.fn();
    let c = Renderer.create(
      <Component {...PROPS} gender="woman" setFilter={setFilter} />
    ).getInstance();

    // toggle the button
    c.onPress();
    expect(setFilter.mock.calls[0][0]).toEqual("unknown");
  });
});
