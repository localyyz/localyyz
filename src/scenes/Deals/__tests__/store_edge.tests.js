import DealStore from "../store";
import mockMoment from "moment";

const NAME = "Deals";

jest.mock("localyyz/global", () => ({
  ApiInstance: {
    get: endpoint => {
      if (endpoint == "deals/active") {
        return {
          data: [
            {
              id: 2,
              name: "LIT Summer Sale",
              description:
                "We're bringing you the latest in fashion, shoes, swimwear, and accessories. From necessary staples to gotta-have-it-now trends to night-out outfits, we have you covered. 15% off + Free Shipping (US only). Discount applied at checkout.",
              imageUrl:
                "https://cdn.shopify.com/s/files/1/1976/6885/files/01-Lit-SpringSummer-Sale-App-Banner.jpg?10230491971092553988",
              imageWidth: 1125,
              imageHeight: 1400,
              gender: "woman",
              ordering: 1,
              createdAt: "2018-01-14T15:02:13.6083Z",
              lightning: true,
              startAt: "2016-01-01T00:00:00Z",
              endAt: "2018-01-01T00:00:00Z",
              status: 2,
              cap: 3,
              products: []
            }
          ],
          status: 200
        };
      } else {
        return {
          data: [
            {
              id: 10,
              name: "Quay Sunglasses",
              description:
                "Sunglasses never looked so good! Quay makes the shades you see on every it-girl, with hip details, popping colors, and trendy frames. Born and raised from festival days, this Aussie-based brand is for the non-conforming and free thinking. 15% off + Free Shipping (US only). Discount applied at checkout.",
              imageUrl:
                "https://cdn.shopify.com/s/files/1/1976/6885/files/06-Lit-QuaySunglasses-Sale-Banner.jpg?73455932399408865",
              imageWidth: 1124,
              imageHeight: 1400,
              gender: "woman",
              ordering: 2,
              createdAt: "2018-05-14T22:28:18.899608Z",
              lightning: true,
              startAt: "2018-01-01T00:00:00Z",
              endAt: "2021-05-01T00:00:00Z",
              status: 1,
              cap: 0,
              products: null
            }
          ],
          status: 200
        };
      }
    }
  }
}));
jest.mock("Moment", () => mockMoment([2019, 1, 1, 1]));

describe(NAME, () => {
  it(`${NAME}: should fetch deals properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.deals[0].id).toBe(2);
    expect(rendered.deals[1].id).toBe(10);
  });

  it(`${NAME}: should return current deal properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.currentDeal.id).toBe(10);
  });

  it(`${NAME}: should return current status properly`, async () => {
    let rendered = new DealStore();
    await rendered.fetch();
    expect(rendered.currentStatus).toBe(1);
  });
});
