import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { Categories } from "../";
let Component = Categories.wrappedComponent;

// constants
const NAME = "Category filter";
const PROPS = {
  categoryFilter: [
    {
      title: "Test",
      fetchPath: "test"
    },
    {
      title: "Another test",
      fetchPath: "test2"
    }
  ]
};

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    const result = renderWithLayout(<Component {...PROPS} />, null, true);
    expect(result.props.children).toBeDefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />, null, true)
    ).toMatchSnapshot();
  });
});
