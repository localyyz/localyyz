import React from "react";
import ProductTile from "../";

// local
import { renderWithLayout } from "localyyz/tests";
import { Product } from "localyyz/models";

const defaultProps = {
  product: new Product({
    variants: [{ price: 10, prevPrice: 20 }]
  }),
  onPress: jest.fn()
};
const defaultLayout = { width: 768 };

describe("ProductTile", () => {
  it("ProductTile: should render properly", () => {
    let rendered = renderWithLayout(
      <ProductTile {...defaultProps} />,
      defaultLayout
    ).getInstance();

    // or use instance test?
    expect(rendered.refs.productTileTouchable).not.toBeUndefined();
    expect(rendered.refs.productTileImage).not.toBeUndefined();
  });

  it("ProductTile: should render price properly", () => {
    let rendered = renderWithLayout(
      <ProductTile {...defaultProps} />,
      defaultLayout
    ).getInstance();

    // or use instance test?
    expect(rendered.refs.productTilePrice.refs.price.props.children).toBe(
      "$10"
    );
  });

  it("ProductTile: should render properly(snapshot)", () => {
    let rendered = renderWithLayout(
      <ProductTile {...defaultProps} />,
      defaultLayout
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
