import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { ProductCount } from "../";
let Component = ProductCount.wrappedComponent;

// constants
const NAME = "Product Count in filter";
const PROPS = {
  numProducts: 25
};

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let c = renderWithLayout(<Component {...PROPS} />).getInstance();

    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should render to snapshot`, () => {
    expect(
      renderWithLayout(<Component {...PROPS} />).toJSON()
    ).toMatchSnapshot();
  });

  it(`${NAME}: should show 0 instead of hiding if numProducts is explicitly 0`, () => {
    let c = renderWithLayout(
      <Component {...PROPS} filterStore={{ numProducts: 0 }} />
    ).getInstance();

    expect(c).not.toBeUndefined();
  });

  it(`${NAME}: should hide if numProducts not provided`, () => {
    let c = renderWithLayout(
      <Component {...PROPS} filterStore={{}} />
    ).getInstance();

    expect(c.render()).toBe(null);
  });
});
