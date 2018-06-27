import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";

// custom
import { renderWithLayout } from "localyyz/tests";

// local
import Field from "../components/Field";

// constants
const NAME = "Field test - form";
const PROPS = {
  label: "sample label",
  onValueChange: jest.fn(),
  validators: [],
  value: "sample value",
  children: "sample children"
};

const Component = Field.wrappedComponent;

/*
  isRequired => bool displays the default label or not
  isValid returns false => display error in base field, error message from validators
*/

describe(NAME, () => {
  it(`${NAME}: should render properly isRequired:false`, () => {
    let comp = renderWithLayout(<Component {...PROPS} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly isRequired:true`, () => {
    let props = { ...PROPS, isRequired: true };
    let comp = renderWithLayout(<Component {...props} />);
    expect(comp.getInstance()).not.toBeUndefined();
    expect(comp.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should properly call the validator functions`, () => {
    let props = PROPS;
    props.validators = [jest.fn(), jest.fn()];
    let comp = renderWithLayout(<Component {...PROPS} />).getInstance();
    expect(comp).not.toBeUndefined();
    expect(PROPS.validators[0]).toHaveBeenCalledTimes(2);
    expect(PROPS.validators[0]).toHaveBeenCalledTimes(2);
  });

  it(`${NAME}: should properly call the onChangeText function`, () => {
    let comp = renderWithLayout(<Component {...PROPS} />).getInstance();
    expect(comp).not.toBeUndefined();
    comp.onUpdate("new value");
    expect(PROPS.onValueChange).toHaveBeenCalledTimes(1);
    //no way to test if the prop value has changed since its coupled to formStore
  });

  it(`${NAME}: should properly display errors when validation fails`, () => {
    let props = PROPS;
    props.validators = [
      data => {
        return data !== "ok" ? "invalid value" : true;
      },
      data => {
        //two validators since higher order validators are supposed to first
        //if behaviour changes in the future we'll catch it here
        return data !== "ok" ? "invalid value 2" : true;
      }
    ];
    let renderer = new ShallowRenderer();
    renderer.render(<Component {...PROPS} />);
    const result = renderer.getRenderOutput();
    expect(result.props.error).toBe("invalid value");
    expect(result).toMatchSnapshot();
  });
});
