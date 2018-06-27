import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import { FilterPopup } from "../";

// constants
const NAME = "FilterPopup";
const MOCK_STORE = jest.mock();
MOCK_STORE.numProducts = 10;
const PROPS = {
  contentStyle: { paddingTop: 100 },
  store: MOCK_STORE,
  onClose: jest.fn()
};

describe(NAME, () => {
  it("should render properly", () => {
    let rendered = renderWithLayout(<FilterPopup {...PROPS} />, null, true);
    expect(rendered).toBeDefined();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<FilterPopup {...PROPS} />, null, true)
    ).toMatchSnapshot();
  });
});
