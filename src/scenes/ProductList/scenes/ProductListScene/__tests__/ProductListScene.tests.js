import React from "react";

// custom
import ShallowRenderer from "react-test-renderer/shallow";

// local
import ProductListScene from "../";
const Component = ProductListScene.wrappedComponent;
let shallowRenderer = new ShallowRenderer();

// constants
const NAME = "ProductListScene";
const PROPS = {
  store: {}
};

describe(NAME, () => {
  it("should render properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = shallowRenderer.getRenderOutput();

    expect(c).toBeDefined();
  });

  it("should match snapshot", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = shallowRenderer.getRenderOutput();

    expect(c).toMatchSnapshot();
  });
});
