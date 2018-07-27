import React from "react";
import Renderer from "react-test-renderer";

import SearchInputBox from "../SearchInputBox";

describe("SearchInputBox", () => {
  it("should render properly", () => {
    let render = Renderer.create(<SearchInputBox.wrappedComponent />);
    expect(render.toJSON()).toMatchSnapshot();
  });
});
