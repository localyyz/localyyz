import React from "react";

// custom
import { findByRef, renderWithLayout } from "localyyz/tests";

// local
import Common from "../Common";

// constants
const NAME = "Common";
const PROPS = {
  asyncFetch: jest.fn(),
  setFilter: jest.fn(),
  clearFilter: jest.fn(),
  data: jest.mock(),
  selected: "",
  title: "filter1"
};

describe(NAME, () => {
  it("should render properly", () => {
    let c = renderWithLayout(<Common {...PROPS} />).getInstance();
    expect(c).toBeDefined();
  });

  it("should render selected properly", () => {
    let c = renderWithLayout(
      <Common {...PROPS} selected="some filter" />
    ).getInstance();
    expect(c.refs.filter1Filter).toBeDefined();
  });

  it("should render expanded properly", () => {
    let c = renderWithLayout(<Common {...PROPS} />).getInstance();
    c.setState({ collapsed: false });
    let result = c.render().props.children;
    expect(result).toHaveLength(2);
    expect(result[1]).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it("should render item properly", () => {
    let c = renderWithLayout(<Common {...PROPS} />).getInstance();
    const item = c.renderItem({ item: "some filter" });
    expect(item).toBeDefined();
    expect(item).toMatchSnapshot();
  });

  it("should render to snapshot", () => {
    expect(renderWithLayout(<Common {...PROPS} />).toJSON()).toMatchSnapshot();
  });
});
