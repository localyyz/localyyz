import React from "react";

// custom
import { renderWithLayout, DEFAULT_TEST_LAYOUT } from "localyyz/tests";

// local
import { Price } from "../";
let Component = Price.wrappedComponent;

// constants
const NAME = "Price filter";
const PROPS = {
  min: 0,
  max: 100,

  // mobx
  setPriceFilter: jest.fn(),
  setScrollEnabled: jest.fn()
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

  it(`${NAME}: should use max and min values on init`, () => {
    let expectedMinValue
      = PROPS.min + Math.round((PROPS.max - PROPS.min) * Component.STEP_SIZE);
    let expectedMaxValue = PROPS.max;
    let rendered = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(rendered.priceMin).toBe(expectedMinValue);
    expect(rendered.priceMax).toBe(expectedMaxValue);
    expect(rendered.refs.slider.props.values).toEqual([
      expectedMinValue,
      expectedMaxValue
    ]);
  });

  it(`${NAME}: should use provided priceMin and priceMax values instead of limits`, () => {
    let expectedMinValue = 40;
    let expectedMaxValue = 50;
    let rendered = renderWithLayout(
      <Component
        {...PROPS}
        priceMin={expectedMinValue}
        priceMax={expectedMaxValue}/>
    ).getInstance();

    expect(rendered.priceMin).toBe(expectedMinValue);
    expect(rendered.priceMax).toBe(expectedMaxValue);
    expect(rendered.refs.slider.props.values).toEqual([
      expectedMinValue,
      expectedMaxValue
    ]);
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });
});
