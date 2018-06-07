import React from "react";
import { HistoryItem } from "../components/HistoryItem";
import Renderer from "react-test-renderer";
import { Product } from "localyyz/models";

const product = {
  id: 1,
  description: "Test Description",
  title: "Sample Test",
  imageUrl: "www.test.com",
  shopUrl: "www.test.com",
  variants: [],
  etc: "etc",
  place: "Test Place",
  sizes: "sizes",
  colors: "green",
  category: "apparel",
  images: [],
  brand: "Test Brand",
  htmlDescription: "Test Html Description",
  noTagDescription: "Test no tag description",
  thumbUrl: "www.test.thumb.com"
};

const props = {
  product: new Product(product),
  lastPrice: 33.521
};

describe("History Item", () => {
  it("History Item: should render properly", () => {
    let rendered = Renderer.create(<HistoryItem {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
