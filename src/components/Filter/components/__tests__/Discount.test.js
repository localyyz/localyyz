import React from "react";

// custom
import { renderWithLayout, DEFAULT_TEST_LAYOUT } from "localyyz/tests";

// local
import { Discount } from "../";
let Component = Discount.wrappedComponent;

// constants
const NAME = "Discount filter";
const PROPS = {
  setDiscountFilter: jest.fn()
};

describe(NAME, () => {
  it("should render properly", () => {
    let rendered = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(rendered).toBeDefined();
    expect(rendered.refs.slider).toBeDefined();

    // length of slider
    expect(rendered.refs.slider.props.sliderLength).toBe(
      DEFAULT_TEST_LAYOUT.width * Component.SLIDER_PERCENTAGE_OF_PARENT_WIDTH
    );
  });

  it("should be 0 on init", () => {
    let rendered = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(rendered.discountMin).toBe(0);
    expect(rendered.refs.slider.props.values).toEqual([0]);
  });

  it("should use provided minDiscount values instead of step size", () => {
    let expectedValue = 0.5;
    let rendered = renderWithLayout(
      <Component {...PROPS} discountMin={expectedValue} />
    ).getInstance();

    expect(rendered.discountMin).toBe(expectedValue);
    expect(rendered.refs.slider.props.values).toEqual([expectedValue]);
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
