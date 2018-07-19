import React from "react";
import Renderer from "react-test-renderer";

// local
import ActiveCard from "../index";

const Component = ActiveCard;

// constants
const NAME = "Deals/ActiveCard";
const PROPS = {
  deal: {
    name: "Tes Store",
    description: "Test Description",
    products: [
      {
        brand: "Test",
        title: "Test Title",
        associatedPhotos: [{ imageUrl: "www.localyyz.com" }],
        price: 6.78,
        place: {
          currency: "USD"
        }
      }
    ],
    usersViewing: 5,
    quantityAvailable: 10,
    percentageClaimed: 0.4
  }
};

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let rendered = Renderer.create(<Component {...PROPS} />);
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
