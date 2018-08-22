import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import ComponentWrapper from "../ProcessingOverlay";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    isProcessing: true,
    ...extra
  };
}

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should not render when not processing", () => {
    let props = createProps({
      isProcessing: false
    });
    let c = renderWithLayout(<Component {...props} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
    expect(layout).toBe(null);
  });
});
