import React from "react";

// custom
import { renderWithLayout, findById } from "localyyz/tests";

// local
import ComponentWrapper from "../content";
const Component = ComponentWrapper.wrappedComponent || ComponentWrapper;

function createProps(extra) {
  return {
    navigateNext: jest.fn(),
    addresses: [],
    fetch: jest.fn(),
    updateShipping: jest.fn(),
    updateBilling: jest.fn(),
    selectedAddress: undefined,
    isShippingAddressComplete: false,
    navigation: {
      navigate: jest.fn()
    },
    ...extra
  };
}

describe(Component.name, () => {
  it("should render properly to snapshot", () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let [instance, layout] = [c.getInstance(), c.toJSON()];

    expect(instance).toBeDefined();
    expect(layout).toMatchSnapshot();
  });

  it("should call fetch on load", () => {
    let props = createProps();
    let fetch = jest.spyOn(Component.prototype, "fetch");
    renderWithLayout(<Component {...props} />);

    expect(fetch).toBeCalled();
  });

  it("should fetch when fetch is called", async () => {
    let props = createProps();
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    // call fetch (which is called and tested by former test)
    expect.assertions(1);
    await instance.fetch();

    expect(props.fetch).toBeCalled();
  });

  it("should select first address if addresses present", async () => {
    let props = createProps({
      addresses: [{ id: 1, address: "first" }, { id: 2, address: "second" }]
    });
    let c = renderWithLayout(<Component {...props} />);
    let instance = c.getInstance();

    // call fetch (which is called and tested by former test)
    expect.assertions(3);
    await instance.fetch();

    expect(props.updateShipping).toBeCalledWith(props.addresses[0]);
    expect(props.updateBilling).toBeCalledWith(props.addresses[0]);
    expect(props.navigation.navigate).not.toBeCalled();
  });

  it("should show next button if complete", async () => {
    let props = createProps({
      isShippingAddressComplete: true
    });
    let c = renderWithLayout(<Component {...props} />, undefined, true);
    let layout = c.toJSON();

    expect(findById(layout, "next")).toBeDefined();
  });
});
