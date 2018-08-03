import React from "react";

// custom
import ShallowRenderer from "react-test-renderer/shallow";
import Renderer from "react-test-renderer";

// local
import { default as Component } from "../List";
let shallowRenderer = new ShallowRenderer();

// constants
const NAME = "Filter List";
const PROPS = {
  title: "Colors",
  filterStore: {}
};

describe(NAME, () => {
  it("should render properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = shallowRenderer.getRenderOutput();

    expect(c).toBeDefined();
  });

  it("should match snapshot", () => {
    let render = Renderer.create(<Component {...PROPS} />).toJSON();
    expect(render).toMatchSnapshot();
  });
});
