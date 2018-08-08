import React from "react";

// custom
import { findById } from "localyyz/tests";
import ShallowRenderer from "react-test-renderer/shallow";
import Renderer from "react-test-renderer";

// local
import { FilterBar, SortOption } from "../FilterBar";
let Component = FilterBar.wrappedComponent;
let SortOptionComponent = SortOption.wrappedComponent;
let shallowRenderer = new ShallowRenderer();

// constants
const NAME = "FilterBar";
const PROPS = {
  store: {},
  numProducts: 100
};

const SO_NAME = "SortOption";
const SO_PROPS = {
  label: "What's new",
  value: "created_at"
};

// helpers
function getHeader(rendered) {
  return rendered.props.children[0].props.ListHeaderComponent;
}

describe(NAME, () => {
  it("should render properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = shallowRenderer.getRenderOutput();

    expect(c).toBeDefined();
  });

  it("should show no filters active", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "brand")).not.toBeDefined();
    expect(findById(c, "price")).not.toBeDefined();
    expect(findById(c, "discount")).not.toBeDefined();
    expect(findById(c, "color")).not.toBeDefined();
    expect(findById(c, "size")).not.toBeDefined();
  });

  it("should show price filter", () => {
    shallowRenderer.render(<Component {...PROPS} store={{ priceMax: 100 }} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "price")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should show brand filter", () => {
    shallowRenderer.render(
      <Component {...PROPS} store={{ brand: "supreme" }} />
    );
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "brand")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should show discount filter", () => {
    shallowRenderer.render(
      <Component {...PROPS} store={{ discountMin: 0.5 }} />
    );
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "discount")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should show color filter", () => {
    shallowRenderer.render(<Component {...PROPS} store={{ color: "black" }} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "color")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should show size filter", () => {
    shallowRenderer.render(<Component {...PROPS} store={{ size: "large" }} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "size")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should show gender filter when no gender is given", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "gender")).toBeDefined();
    expect(c).toMatchSnapshot();
  });

  it("should hide gender filter", () => {
    shallowRenderer.render(<Component {...PROPS} hideGenderFilter={true} />);
    const c = getHeader(shallowRenderer.getRenderOutput());

    expect(findById(c, "gender")).not.toBeDefined();
  });

  it("should render to snapshot", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe(SO_NAME, () => {
  it("should render properly", () => {
    let render = Renderer.create(
      <SortOptionComponent {...SO_PROPS} sortBy={SO_PROPS.value} />
    ).toJSON();

    expect(render).toBeDefined();
  });

  it("should render to snapshot", () => {
    let render = Renderer.create(
      <SortOptionComponent {...SO_PROPS} sortBy={SO_PROPS.value} />
    ).toJSON();

    expect(render).toMatchSnapshot();
  });

  it("should be highlighted", () => {
    let render = Renderer.create(
      <SortOptionComponent {...SO_PROPS} sortBy={SO_PROPS.value} />
    ).getInstance();
    expect(render.isSelected).toBeTruthy();
  });

  it("should be not be highlighted", () => {
    let render = Renderer.create(
      <SortOptionComponent {...SO_PROPS} />
    ).getInstance();
    expect(render.isSelected).toBeFalsy();
  });

  it("should set on toggle if unset", () => {
    let setSortBy = jest.fn();
    let render = Renderer.create(
      <SortOptionComponent {...SO_PROPS} setSortBy={setSortBy} />
    ).getInstance();

    // press the button
    render.onPress();
    expect(setSortBy.mock.calls[0][0]).toBe(SO_PROPS.value);
  });

  it("should unset on toggle if set", () => {
    let setSortBy = jest.fn();
    let render = Renderer.create(
      <SortOptionComponent
        {...SO_PROPS}
        sortBy={SO_PROPS.value}
        setSortBy={setSortBy}/>
    ).getInstance();

    // press the button
    render.onPress();
    expect(setSortBy.mock.calls[0][0]).toEqual(undefined);
  });

  it("should reverse direction on toggle if has direction and is set", () => {
    let setSortBy = jest.fn();
    let render = Renderer.create(
      <SortOptionComponent
        {...SO_PROPS}
        hasDirection
        sortBy={SO_PROPS.value}
        setSortBy={setSortBy}/>
    ).getInstance();

    // press the button
    render.onPress();
    expect(setSortBy.mock.calls[0][0]).toBe(`-${SO_PROPS.value}`);
  });

  it("should unset on toggle if has direction and is set to descending", () => {
    let setSortBy = jest.fn();
    let render = Renderer.create(
      <SortOptionComponent
        {...SO_PROPS}
        hasDirection
        sortBy={`-${SO_PROPS.value}`}
        setSortBy={setSortBy}/>
    ).getInstance();

    // press the button
    render.onPress();
    expect(setSortBy.mock.calls[0][0]).toEqual(null);
  });
});
