import React from "react";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import GoogleAddress from "../components/GoogleAddress";

// constants
const NAME = "Address test - form";
const PROPS = {
  onValueChange: address => {
    //not ideal should ideally be in the it() function
    //however _onAddressSelect calls props.onValueChange with the address it picked up
    //it does not return the address so we must check it here
    expect(address.address).toBe("180 John Street");
    expect(address.city).toBe("Toronto");
    expect(address.province).toBe("Ontario");
    expect(address.country).toBe("Canada");
    expect(address.countryCode).toBe("CA");
    expect(address.zip).toBe("M5T 1XF");
  },
  update: jest.fn(),
  addCallback: jest.fn()
};

const Component = GoogleAddress.wrappedComponent;

describe(NAME, () => {
  it(`${NAME}: should interpret address properly`, () => {
    let details = {
      address_components: [
        {
          types: ["street_number"],
          short_name: "180"
        },
        {
          types: ["route"],
          short_name: "John Street"
        },
        {
          types: ["sublocality_level_1"],
          short_name: "Toronto"
        },
        {
          types: ["administrative_area_level_1"],
          short_name: "Ontario"
        },
        {
          types: ["country"],
          long_name: "Canada",
          short_name: "CA"
        },
        {
          types: ["postal_code"],
          short_name: "M5T 1XF"
        }
      ]
    };
    let comp = renderWithLayout(<Component {...PROPS} />);
    expect(comp.getInstance()).toBeDefined();
    expect(comp.toJSON()).toMatchSnapshot();
    comp.getInstance()._onAddressSelect({}, details);
  });
});
