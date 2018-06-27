import React from "react";
import Renderer from "react-test-renderer";
import Order from "..";

const PROPS = {
  createdAt: "2018-06-01",
  items: [
    {
      id: 1,
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
    },
    {
      id: 2,
      product: {
        brand: "Adidas",
        images: [
          {
            imageUrl: "www.adidas.com/img/2",
            width: 100,
            height: 100
          }
        ]
      }
    }
  ]
};
describe("Order", () => {
  it("Order: should render the flatlist properly", () => {
    const rendered = Renderer.create(<Order {...PROPS} />);
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
