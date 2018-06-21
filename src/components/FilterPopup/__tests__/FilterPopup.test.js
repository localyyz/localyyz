import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { default as FilterPopup, FilterContent } from "../";
let Component = FilterPopup.wrappedComponent;

// constants
const NAME = "FilterPopup";
const PROPS = {
  filterStore: {},
  contentStyle: { paddingTop: 100 },
  isVisible: true
};

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let rendered = renderWithLayout(<Component {...PROPS} />, {}, true);
    expect(rendered).toBeDefined();
  });

  it(`${NAME}: should hide to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} isVisible={false} />, {}, true)
    ).toMatchSnapshot();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />, {}, true)
    ).toMatchSnapshot();
  });
});

describe("Filter Content", () => {
  it("should render properly", () => {
    let rendered = renderWithLayout(<FilterContent />, {}, true);
    expect(rendered).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(renderWithLayout(<FilterContent />, {}, true)).toMatchSnapshot();
  });
});
