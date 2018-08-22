import DealStore from "../store";
import mockMoment from "moment";

const NAME = "Deals";

jest.mock("localyyz/global", () => ({
  GA: {
    trackEvent: jest.fn,
    trackScreen: jest.fn
  },
  ApiInstance: {
    get: endpoint => {
      if (endpoint == "deals/active") {
        return {
          data: [],
          status: 200
        };
      } else {
        return {
          data: [],
          status: 200
        };
      }
    }
  }
}));
jest.mock("Moment", () => mockMoment([2018, 1, 1, 1]));

describe(NAME, () => {
  it(`${NAME}: should fetch deals properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.deals.length).toBe(0);
  });

  it(`${NAME}: should return current deal properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.currentDeal).toBe(undefined);
  });

  it(`${NAME}: should return current status properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.currentStatus).toBe(3);
  });
});
