import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";
import { Sizes } from "localyyz/constants";

// local
import ComponentWrapper from "../Progress";
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
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should render progress items properly", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "second")).toBeDefined();
    expect(findById(layout, "second")).toMatchSnapshot();
  });

  it("should not render hidden steps", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "third")).not.toBeDefined();
  });

  it("should highlight active steps and its previous steps", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let layout = c.toJSON();

    expect(findById(layout, "first").props.style.borderBottomWidth).toBe(1);
    expect(findById(layout, "second").props.style.borderBottomWidth).toBe(1);
    expect(findById(layout, "fourth").props.style[0].borderBottomWidth).toBe(
      Sizes.Spacer
    );
  });
});
