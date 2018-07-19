import React from "react";
import Renderer from "react-test-renderer";

// local
import Background from "../Background";
const Component = Background;

// constants
const NAME = "Deals/UpcomingCard";
const PROPS = {
  currentTimerTargetArray: []
};

describe(NAME, () => {
  it(`${NAME}: should render properly - Deal Waiting Content`, () => {
    let props = { ...PROPS, currentStatus: 0 };
    let comp = Renderer.create(<Component.wrappedComponent {...props} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly - Deal Active Content`, () => {
    let props = { ...PROPS, currentStatus: 1 };
    let comp = Renderer.create(<Component.wrappedComponent {...props} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly - Deal Missed Content`, () => {
    let props = { ...PROPS, currentStatus: 2 };
    let comp = Renderer.create(<Component.wrappedComponent {...props} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly - Deal Expired Content`, () => {
    let props = { ...PROPS, currentStatus: 3 };
    let comp = Renderer.create(<Component.wrappedComponent {...props} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });
});
