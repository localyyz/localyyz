import React from "react";
import Renderer from "react-test-renderer";

// local
import Error from "../components/Error";

// constants
const NAME = "Error Test - Form";
const PROPS = {
  children: "sample chidren"
};

const Component = Error;

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      Renderer.create(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
