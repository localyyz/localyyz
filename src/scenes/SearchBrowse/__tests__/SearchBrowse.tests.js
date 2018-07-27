import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";

import SearchBrowse from "../SearchBrowse";
const renderer = new ShallowRenderer();

describe("SearchBrowse", () => {
  it("should render properly", () => {
    const result = renderer.render(<SearchBrowse />);
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });
});
