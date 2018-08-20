import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../CartBaseScene";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  scenes: [
    { id: "first", label: "First scene" },
    { id: "second", label: "Second scene" },
    { id: "third", label: "Third scene", isHidden: true },
    { id: "fourth", label: "Fourth scene" }
  ],
  navigation: {},
  activeSceneId: "second"
};

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} keySeed="test" />,
      undefined,
      true
    );
    let layout = c.toJSON();

    expect(layout).toMatchSnapshot();
  });
});
