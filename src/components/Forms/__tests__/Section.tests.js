import React from "react";
import Renderer from "react-test-renderer";

// local
import Section from "../components/Section";

// constants
const NAME = "Section Test - Form";
const PROPS = {
  label: "Sample Label",
  style: {}
};

const Component = Section;

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = Renderer.create(<Component {...PROPS} />).getInstance();
    expect(c).toBeDefined();
  });

  it(`${NAME}: should render to snapshot: hasMargin=true`, () => {
    PROPS.hasMargin = true;
    expect(
      Renderer.create(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });

  it(`${NAME}: should render to snapshot: hasMargin=false`, () => {
    PROPS.hasMargin = false;
    expect(
      Renderer.create(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
