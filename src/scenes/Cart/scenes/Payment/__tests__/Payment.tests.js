import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../index";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    ...extra
  };
}

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let props = createProps();
    let c = renderWithLayout(
      <Component {...props} keySeed="test" />,
      undefined,
      true
    );
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });
});
