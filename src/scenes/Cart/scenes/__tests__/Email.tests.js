import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../Email";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  updateEmail: jest.fn(),
  navigateNext: jest.fn()
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

  it("should not show next button if no email", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} keySeed="test" />,
      undefined,
      true
    );
    let layout = c.toJSON();

    expect(findById(layout, "next")).not.toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should show next button if email given", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} email="ken@kenma.ca" keySeed="test" />,
      undefined,
      true
    );
    let layout = c.toJSON();

    expect(findById(layout, "next")).toBeDefined();
    expect(layout).toMatchSnapshot();
  });
});
