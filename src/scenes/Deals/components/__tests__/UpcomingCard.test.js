import React from "react";

// third party
import mockMoment from "moment";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import UpcomingCard from "../UpcomingCard/index";
const Component = UpcomingCard;

// constants
const NAME = "Deals/UpcomingCard";
const PROPS = {
  deal: {
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1976/6885/files/01-Lit-SpringSummer-Sale-App-Banner.jpg?10230491971092553988",
    imageWidth: 100,
    imageHeight: 100,
    name: "Deal",
    startAt: "2018-01-01T00:00:00.6083Z"
  }
};

// jest
jest.mock("Moment", () => mockMoment([2018, 1, 1, 12]));

describe(NAME, () => {
  it(`${NAME}: should render properly`, () => {
    let comp = renderWithLayout(<Component {...PROPS} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });
});
