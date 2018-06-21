import React from "react";
import Renderer from "react-test-renderer";

import OrderItem from "../components/OrderItem";
const PROPS = {
  item: {
    product: {
      brand: "Fenty x Puma",
      images: [
        {
          imageUrl: "www.fentyxpuma.com/img/1",
          width: 100,
          height: 100
        }
      ]
    }
  }
};
describe("OrderItem", () => {
  it("OrderItems: should render properly - order status : completed", () => {
    let props = {
      ...PROPS,
      order: { status: "completed", updatedAt: "2018-06-01" }
    };
    let rendered = Renderer.create(<OrderItem {...props} />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it("OrderItems: should render properly - order status : payment_success", () => {
    let props = {
      ...PROPS,
      order: { status: "payment_success", updatedAt: "2018-06-01" }
    };
    let rendered = Renderer.create(<OrderItem {...props} />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it("OrderItems: should render properly - order status : checkout", () => {
    let props = {
      ...PROPS,
      order: { status: "checkout", updatedAt: "2018-06-01" }
    };
    let rendered = Renderer.create(<OrderItem {...props} />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
