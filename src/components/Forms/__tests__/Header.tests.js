import React from "react";
import Renderer from "react-test-renderer";

// local
import Header from "../components/Header";

// constants
const NAME = "Header Test - Form";
const PROPS = {
  labelStyle: { color: "green" },
  children: "sample children"
};

const Component = Header;

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(c).toBeDefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      Renderer.create(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
