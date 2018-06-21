import React from "react";
import Renderer from "react-test-renderer";

// local
import PickerProvider from "../Provider/index";

// constants
const NAME = "PickerProvider Test - Form";
const PROPS = {
  children: "sample children",
  getField: input => {
    //this is a mock function for the formStore
    //formStore returns value based on input but since we are returning same value no need to use
    return {
      options: {
        test: {
          label: "sample"
        }
      }
    };
  },
  onValueChange: jest.fn()
};

const Component = PickerProvider;

describe(NAME, () => {
  it(`${NAME}: should render properly isVisible:true`, () => {
    let rendered = Renderer.create(<Component.wrappedComponent {...PROPS} />);
    rendered.getInstance().store.isVisible = true; //set it to true
    rendered.getInstance().store.visibleField = "sample"; //set the visible field
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it(`${NAME}: should render properly isVisible:false`, () => {
    let rendered = Renderer.create(<Component.wrappedComponent {...PROPS} />);
    expect(rendered.toJSON()).toMatchSnapshot();
    expect(PROPS.onValueChange).toHaveBeenCalledTimes(0);
  });
});
