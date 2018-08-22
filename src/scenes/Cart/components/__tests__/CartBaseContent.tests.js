import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../CartBaseContent";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {};

describe(ComponentWrapper.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });
});
