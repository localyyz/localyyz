import React from "react";
import Renderer from "react-test-renderer";

// local
import BaseField from "../components/BaseField";

// constants
const NAME = "Base Field test - form";
const PROPS = {
  label: "sample label",
  error: "sample error",
  onPress: jest.fn(),
  style: { backgroundColor: "red" }
};

const Component = BaseField;

describe(NAME, () => {
  it(`${NAME}: should render properly hasMargin:false`, () => {
    let props = { ...PROPS, onPress: jest.fn(), hasMargin: false };
    let comp = Renderer.create(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly hasMargin:true`, () => {
    let props = { ...PROPS, onPress: jest.fn(), hasMargin: true };
    let comp = Renderer.create(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly hasError:true`, () => {
    let props = {
      ...PROPS,
      onPress: jest.fn(),
      hasMargin: false,
      hasError: true
    };
    let comp = Renderer.create(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly no onPress() given`, () => {
    let props = { ...PROPS, hasMargin: true, hasError: true };
    let comp = Renderer.create(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly isHorizontal:false`, () => {
    let props = {
      ...PROPS,
      hasMargin: true,
      hasError: true,
      isHorizontal: false
    };
    let comp = Renderer.create(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });
});
