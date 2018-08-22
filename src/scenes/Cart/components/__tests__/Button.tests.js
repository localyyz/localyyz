import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../Button";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  isReady: true,
  onPress: jest.fn(),
  children: "Press me"
};

describe(ComponentWrapper.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();

    // check if button is pressable
    expect(layout.props.onStartShouldSetResponder).toBeDefined();
  });

  it("should render properly to snapshot and hide label + pressable on not ready", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} isReady={false} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();

    // check if "Press me" was hidden and unpressable
    expect(layout.props.onStartShouldSetResponder).not.toBeDefined();
    expect(layout.children[0].children[0].children[0].type).toBe(
      "ActivityIndicator"
    );
  });
});
