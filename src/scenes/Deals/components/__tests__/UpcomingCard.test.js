import React from "react";

// third party
import mockMoment from "moment";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import UpcomingCard from "../UpcomingCard";
const Component = UpcomingCard;

// constants
const NAME = "Deals/UpcomingCard";
const PROPS = {
  deal: {
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
