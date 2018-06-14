import React from "react";
import Addresses, { AddressSelect } from "../components/Addresses";
import Renderer from "react-test-renderer";
import ShallowRenderer from "react-test-renderer/shallow";

import { UserAddress } from "localyyz/models";
import { findById, findByKey } from "localyyz/tests";

const address1 = new UserAddress({
  id: 1,
  firstName: "paul",
  lastName: "localyyz",
  address: "123 Toronto street",
  city: "toronto",
  country: "canada",
  province: "ontario",
  zip: "abc 789"
});
const address2 = new UserAddress({
  id: 2,
  firstName: "paul2",
  lastName: "localyyz",
  address: "180 john street",
  city: "toronto",
  country: "canada",
  province: "ontario",
  zip: "xyz 123"
});

describe("Addresses", () => {
  const defaultProps = {
    title: "Sample Address",
    addresses: [address1, address2],
    address: address1,
    fetch: () => {},
    update: () => {},
    remove: () => {}
  };

  it("should render properly", () => {
    let renderer = new ShallowRenderer();
    renderer.render(<Addresses.wrappedComponent {...defaultProps} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children).toBeDefined();
  });

  it("should not be editing by default", () => {
    let renderer = new ShallowRenderer();
    renderer.render(<Addresses.wrappedComponent {...defaultProps} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children).toBeDefined();
    expect(result.props.children[1].props.isEditing).toBeFalsy();
  });

  it("should be isEditing if address has error", () => {
    let renderer = new ShallowRenderer();
    renderer.render(
      <Addresses.wrappedComponent
        {...defaultProps}
        address={{ ...address1, hasError: true }}/>
    );
    const result = renderer.getRenderOutput();

    expect(result.props.children).toHaveLength(2);
    expect(result.props.children[1]).toBeDefined();
    expect(result.props.children[1].props.isEditing).toBeTruthy();
  });

  it("should be isEditing if no addresses", () => {
    let renderer = new ShallowRenderer();
    renderer.render(
      <Addresses.wrappedComponent {...defaultProps} addresses={[]} />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.children).toHaveLength(2);
    expect(result.props.children[1]).toBeDefined();
    expect(result.props.children[1].props.isEditing).toBeTruthy();
  });

  it("should match snapshot when complete", () => {
    let renderer = new ShallowRenderer();
    const result = renderer.render(
      <Addresses.wrappedComponent {...defaultProps} />
    );
    expect(result).toMatchSnapshot();
  });

  it("should match snapshot when incomplete", () => {
    let renderer = new ShallowRenderer();
    const result = renderer.render(
      <Addresses.wrappedComponent
        {...defaultProps}
        address={{ ...address1, hasError: true }}/>
    );
    expect(result).toMatchSnapshot();
  });
});

describe("AddressSelect", () => {
  const defaultProps = {
    isEditing: false,
    addresses: [address1, address2],
    onSelect: jest.fn(),
    onRemove: jest.fn(),
    onCreate: jest.fn(),
    onEdit: jest.fn(),
    onCancel: jest.fn()
  };

  it("should render address form when editing", () => {
    let renderer = new ShallowRenderer();
    renderer.render(<AddressSelect {...defaultProps} isEditing={true} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children).toBeDefined();
    expect(findById(result, "addressForm")).toBeDefined();
  });

  it("should render addresses when not editing", () => {
    let renderer = new ShallowRenderer();
    renderer.render(<AddressSelect {...defaultProps} isEditing={false} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children).toBeDefined();
    expect(findById(result, "addressForm")).toBeUndefined();
    expect(result.props.children.props.children).toHaveLength(2);

    // render 2 addresses for selection
    expect(findByKey(result, "address-1")).toBeDefined();
    expect(findByKey(result, "address-2")).toBeDefined();
    expect(findById(result, "addressNew")).toBeDefined();
  });

  // TODO: should not show address for selection
  // TODO: should auto select first address
  it("should hide addresses when complete", () => {});
  it("should select first address", () => {});

  it("should match snapshot when selecting addresses", () => {
    let renderer = new ShallowRenderer();
    const result = renderer.render(<AddressSelect {...defaultProps} />);
    expect(result).toMatchSnapshot();
  });

  it("should match snapshot when editing", () => {
    let renderer = new ShallowRenderer();
    const result = renderer.render(
      <AddressSelect {...defaultProps} isEditing={true} />
    );
    expect(result).toMatchSnapshot();
  });
});
