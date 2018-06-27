import React from "react";
import Renderer from "react-test-renderer";

import SettingsMenu from "..";

const PROPS = {
  userStore: {},
  navigation: {
    navigate: jest.fn()
  },
  logout: jest.fn()
};
describe("Settings Menu", () => {
  it("Settings Menu: should render properly when user is not logged in", () => {
    let props = {
      ...PROPS,
      hasSession: false
    };
    const rendered = Renderer.create(
      <SettingsMenu.wrappedComponent {...props} />
    );
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it("Settings Menu: should render properly user is logged in", () => {
    let props = {
      ...PROPS,
      hasSession: true
    };
    const rendered = Renderer.create(
      <SettingsMenu.wrappedComponent {...props} />
    );
    expect(rendered.getInstance()).toBeDefined();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
