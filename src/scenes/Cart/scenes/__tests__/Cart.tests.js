import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../Cart";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  isEmpty: false,
  fetchFromDb: jest.fn(),
  navigation: {
    addListener: jest.fn()
  }
};

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} keySeed="test" />,
      undefined,
      true
    );
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should show cart if items present", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} keySeed="test" />,
      undefined,
      true
    );
    let layout = c.toJSON();

    expect(findById(layout, "cart")).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should show empty if no items", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} isEmpty={true} keySeed="test" />,
      undefined,
      true
    );
    let layout = c.toJSON();

    expect(findById(layout, "cart")).not.toBeDefined();
    expect(layout).toMatchSnapshot();
  });
});
