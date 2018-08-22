import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";
import { toPriceString } from "localyyz/helpers";

// local
import ComponentWrapper from "../Totals";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

const DEFAULT_PROPS = {
  totalPrice: 100,
  totalDiscount: 300
};

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let c = renderWithLayout(<Component {...DEFAULT_PROPS} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();

    expect(findById(layout, "price")).toBeDefined();
    expect(findById(layout, "discount")).toBeDefined();

    expect(findById(layout, "price").children[0]).toBe(
      toPriceString(DEFAULT_PROPS.totalPrice),
      null,
      true
    );
    expect(findById(layout, "discount").children[0]).toBe(
      toPriceString(DEFAULT_PROPS.totalDiscount),
      null,
      true
    );
  });

  it("should hide discount if none", () => {
    let c = renderWithLayout(
      <Component {...DEFAULT_PROPS} totalDiscount={0} />
    );
    let layout = c.toJSON();

    expect(findById(layout, "price")).toBeDefined();
    expect(findById(layout, "discount")).not.toBeDefined();
  });
});
