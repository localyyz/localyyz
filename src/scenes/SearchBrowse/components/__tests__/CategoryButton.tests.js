import React from "react";
import Renderer from "react-test-renderer";

import CategoryButton from "../CategoryButton";

const DEFAULT_PROPS = {
  id: "activewear",
  type: "activewear",
  title: "Activewear",
  values: [],
  imageUrl:
    "https://cdn.shopify.com/s/files/1/1825/3189/products/1589d1c85bfdd70a943bbcc2c75374d6.jpg"
};

describe("CategoryButton", () => {
  it("should render properly", () => {
    let render = Renderer.create(<CategoryButton {...DEFAULT_PROPS} />);
    expect(render.toJSON()).toMatchSnapshot();
  });

  it("should render properly (isSmall)", () => {
    let render = Renderer.create(<CategoryButton isSmall {...DEFAULT_PROPS} />);
    expect(render.toJSON()).toMatchSnapshot();
  });
});
