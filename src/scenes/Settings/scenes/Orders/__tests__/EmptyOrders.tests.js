import React from "react";
import Renderer from "react-test-renderer";
import EmptyOrders from "../components/EmptyOrders";

describe("EmptyOrders", () => {
  it("EmptyOrders: should render without failure", () => {
    const rendered = Renderer.create(<EmptyOrders />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
