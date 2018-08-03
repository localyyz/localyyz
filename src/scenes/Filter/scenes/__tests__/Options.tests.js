import React from "react";

// custom
import Renderer from "react-test-renderer";

// local
import { Options } from "../List";
const Component = Options.wrappedComponent;

// constants
const NAME = "Filter Options";
const PROPS = {
  ccs: { headerHeight: 0 },
  data: []
};

describe(NAME, () => {
  it("should render properly", () => {
    let render = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(render).toBeDefined();
  });

  it("should match snapshot", () => {
    let render = Renderer.create(<Component {...PROPS} />).toJSON();
    expect(render).toMatchSnapshot();
  });

  it("should have only two section lists (the headers) with no data", () => {
    let render = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(render.sections.length).toEqual(2);
  });

  it("should have only a, b, and two headers as sections", () => {
    let render = Renderer.create(
      <Component {...PROPS} data={["a", "aa", "b", "bb", "bbb"]} />
    ).getInstance();
    expect(render.sections.length).toEqual(4);
  });
});
