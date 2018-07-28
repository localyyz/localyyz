import React from "react";
import Renderer from "react-test-renderer";

import CategoryGender from "../CategoryGender";

describe("CategoryGender", () => {
  it("should render properly", () => {
    let render = Renderer.create(<CategoryGender.wrappedComponent />);
    expect(render.toJSON()).toMatchSnapshot();
  });

  it("should render properly with user gender", () => {
    const PROPS = {
      userGender: "female",
      setGender: jest.fn()
    };

    let render = Renderer.create(
      <CategoryGender.wrappedComponent {...PROPS} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });

  it("should render properly with selected gender", () => {
    const PROPS = {
      gender: "female",
      setGender: jest.fn()
    };

    let render = Renderer.create(
      <CategoryGender.wrappedComponent {...PROPS} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });
});
