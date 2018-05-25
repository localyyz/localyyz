import React from "react";
import BlockSliderButton from "../BlockSliderButton.js";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  let props = {
    homeStore: {},
    block: {},
    currentBlock: "current-block"
  };

  const rendered = renderer.create(<BlockSliderButton {...props} />).toJSON();
  expect(rendered).toBeTruthy();
});

it("renders block type properly", () => {
  let blockType = "some-block";
  let props = {
    homeStore: {},
    block: { type: blockType },
    currentBlock: "block1",
    id: "block1"
  };

  const rendered = renderer.create(<BlockSliderButton {...props} />).toJSON();
  expect(rendered.children[0].children[0]).toBe(blockType);
});

it("renders block title properly", () => {
  let blockTitle = "some-title";
  let props = {
    homeStore: {},
    block: { title: blockTitle },
    currentBlock: "block1",
    id: "block1"
  };

  const rendered = renderer.create(<BlockSliderButton {...props} />).toJSON();
  expect(rendered.children[0].children[0]).toBe(blockTitle);
});

it("renders selected block style", () => {
  let blockTitle = "some-title";
  let props = {
    homeStore: {
      currentTrackedBlock: "block1"
    },
    block: { title: blockTitle },
    id: "block1"
  };

  const rendered = renderer.create(<BlockSliderButton {...props} />).toJSON();
  expect(rendered.children[0].props.style[1]).toBeTruthy();
});

it("renders non-selected block style", () => {
  let blockTitle = "some-title";
  let props = {
    homeStore: {
      currentTrackedBlock: "block2"
    },
    block: { title: blockTitle },
    id: "block1"
  };

  const rendered = renderer.create(<BlockSliderButton {...props} />).toJSON();
  expect(rendered.children[0].props.style[1]).toBeFalsy();
});
