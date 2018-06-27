import React from "react";
import Renderer from "react-test-renderer";
import Addresses from "../index";

const PROPS = {
  navigation: {
    navigate: jest.fn(),
    state: {
      params: "test"
    }
  },
  fetch: jest.fn(),
  addresses: [
    { id: 1, address: "180 John Street West" },
    { id: 2, address: "120 John Street East" }
  ]
};
describe("Settings Addresses", () => {
  it("Settings Addresses: should render properly", () => {
    const rendered = Renderer.create(<Addresses.wrappedComponent {...PROPS} />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
