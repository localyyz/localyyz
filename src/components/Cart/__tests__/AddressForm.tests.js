import React from "react";
import AddressForm from "../components/AddressForm";
import Renderer from "react-test-renderer";
import Colours from "../../../constants/colours";

const props = {
  cartUiStore: {
    defaultName: "Localyyz"
  },
  addressStore: {
    add: () => {},
    update: () => {}
  },
  address: {
    address: "180 John Street",
    city: "Toronto",
    province: "ON",
    zip: "M2J 3J3",
    country: "Canada"
  },
  onSubmit: () => {}
};

describe("Address Form", () => {
  it("Address Form: should be able to enter address in Google form", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.address.address).toBe("180 John Street");
    expect(rendered.state.address.city).toBe("Toronto");
    expect(rendered.state.address.country).toBe("Canada");
    expect(rendered.state.address.zip).toBe("M2J 3J3");
    expect(rendered.state.address.province).toBe("ON");
    expect(rendered.refs.name.props.value).toBe("Localyyz");
    expect(rendered.refs.manualAddress.props.value).toBe("180 John Street");
    expect(rendered.refs.addressOpt.props.value).toBe("");
    expect(rendered.refs.manualCity.props.value).toBe("Toronto");
    expect(rendered.refs.manualProvince.props.value).toBe("ON");
    expect(rendered.refs.manualCountry.props.value).toBe("Canada");
    expect(rendered.refs.manualPostal.props.value).toBe("M2J 3J3");
  });

  it("Address Form: should be able to enter name after entering address in Google", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.name).toBe("Localyyz");
    expect(rendered.refs.name.props.value).toBe("Localyyz");
    rendered.onNameUpdate("Johnny Appleseed");
    expect(rendered.state.name).toBe("Johnny Appleseed");
    expect(rendered.refs.name.props.value).toBe("Johnny Appleseed");
  });

  it("Address Form: should be able to manually edit address after entering address in Google", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.address.address).toBe("180 John Street");
    expect(rendered.refs.manualAddress.props.value).toBe("180 John Street");
    rendered.onAddressComponentUpdate("address", "185 John Street");
    expect(rendered.state.address.address).toBe("185 John Street");
    expect(rendered.refs.manualAddress.props.value).toBe("185 John Street");
  });

  it("Address Form: should be able to manually edit state after entering address in Google", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.address.province).toBe("ON");
    expect(rendered.refs.manualProvince.props.value).toBe("ON");
    rendered.onAddressComponentUpdate("province", "AB");
    expect(rendered.state.address.province).toBe("AB");
    expect(rendered.refs.manualProvince.props.value).toBe("AB");
  });

  it("Address Form: should be able to manually edit country after entering address in Google", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.address.country).toBe("Canada");
    expect(rendered.refs.manualCountry.props.value).toBe("Canada");
    rendered.onAddressComponentUpdate("country", "France");
    expect(rendered.state.address.country).toBe("France");
    expect(rendered.refs.manualCountry.props.value).toBe("France");
  });

  it("Address Form: should be able to manually edit zip after entering address in Google", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    expect(rendered.state.address.zip).toBe("M2J 3J3");
    expect(rendered.refs.manualPostal.props.value).toBe("M2J 3J3");
    rendered.onAddressComponentUpdate("zip", "M2J 5HN");
    expect(rendered.state.address.zip).toBe("M2J 5HN");
    expect(rendered.refs.manualPostal.props.value).toBe("M2J 5HN");
  });

  it("Address Form: should turn name field red if empty", () => {
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    rendered.onSaveAddress();
    expect(rendered.state.isNameInvalid).toBe(true);
    expect(rendered.refs.name.props.style[1].color).toBe(Colours.Fail);
  });

  it("Address Form: should alert user if a form field is invalid", () => {
    const mockAlert = jest.fn();
    let rendered = Renderer.create(<AddressForm {...props} />).getInstance()
      .wrappedInstance;
    rendered.onAddressSelect(
      "180 John Street, Toronto, Ontario, Canada m2j3j3",
      { address_components: [] }
    );
    rendered.onAddressComponentUpdate("zip", "");
    rendered.onSaveAddress(mockAlert);
    expect(mockAlert.mock.calls.length).toBe(1);
  });
});
