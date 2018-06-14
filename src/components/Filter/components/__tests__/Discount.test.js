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
  it(`${NAME}: should render properly`, () => {
    let rendered = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(rendered).not.toBeUndefined();
    expect(rendered.refs.slider).not.toBeUndefined();

    // length of slider
    expect(rendered.refs.slider.props.sliderLength).toBe(
      DEFAULT_TEST_LAYOUT.width * Component.SLIDER_PERCENTAGE_OF_PARENT_WIDTH
    );
  });

  it(`${NAME}: should use step size values on init`, () => {
    let rendered = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(rendered.discountMin).toBe(Component.STEP_SIZE);
    expect(rendered.refs.slider.props.values).toEqual([Component.STEP_SIZE]);
  });

  it(`${NAME}: should use provided minDiscount values instead of step size`, () => {
    let expectedValue = 0.5;
    let rendered = renderWithLayout(
      <Component {...PROPS} discountMin={expectedValue} />
    ).getInstance();

    expect(rendered.discountMin).toBe(expectedValue);
    expect(rendered.refs.slider.props.values).toEqual([expectedValue]);
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
