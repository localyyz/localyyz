import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Common } from "../Common";

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

  it("should render to snapshot", () => {
    expect(renderWithLayout(<Common {...PROPS} />).toJSON()).toMatchSnapshot();
  });
});
