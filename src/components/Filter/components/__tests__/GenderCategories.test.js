import React from "react";

// custom
import { findByKey, findByRef, renderWithLayout } from "localyyz/tests";
import ShallowRenderer from "react-test-renderer/shallow";

// local
import GenderCategories, { GENDER_SECTION } from "../GenderCategories";
let Component = GenderCategories.wrappedComponent;
let shallowRenderer = new ShallowRenderer();

// constants
const NAME = "Category filter";
const PROPS = {
  categories: [
    {
      title: "Apparel",
      value: "apparel"
    },
    {
      title: "Shoes",
      value: "shoes"
    }
  ],
  fetchCategories: jest.fn()
};

describe(NAME, () => {
  it("should render properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const result = shallowRenderer.getRenderOutput();
    expect(result).toBeDefined();

    const content = findByRef(result, "genderCategories");
    expect(content).toBeDefined();
    expect(content.props.sections).toEqual(
      expect.arrayContaining(GENDER_SECTION)
    );
    expect(content).toMatchSnapshot();
  });

  it("should render content properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const result = shallowRenderer
      .getRenderOutput()
      .props.children.props.renderContent();

    expect(findByRef(result, "genderCategoriesContent")).toBeDefined();
    const list = findByRef(result, "genderCategoriesList");
    expect(list).toBeDefined();
    expect(list.props.data).toEqual(expect.arrayContaining(PROPS.categories));

    expect(result).toMatchSnapshot();
    expect(list).toMatchSnapshot();
  });

  it("should render content with selected properly", () => {
    shallowRenderer.render(<Component {...PROPS} selected="apparel" />);
    const content = shallowRenderer
      .getRenderOutput()
      .props.children.props.renderContent();

    expect(content.props.children[0]).toBeTruthy();

    expect(content).toMatchSnapshot();
  });

  it("should render header properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const result = shallowRenderer
      .getRenderOutput()
      .props.children.props.renderHeader(GENDER_SECTION[0]);
    expect(result).toBeDefined();

    const header = findByKey(result, GENDER_SECTION[0].value);
    expect(header).toBeDefined();
    expect(header.props.value).toEqual(GENDER_SECTION[0].value);
    expect(header.props.label).toEqual(GENDER_SECTION[0].label);

    expect(header).toMatchSnapshot();
  });

  it("should render items properly", () => {
    shallowRenderer.render(<Component {...PROPS} />);
    const result = shallowRenderer
      .getRenderOutput()
      .props.children.props.renderContent();

    const list = findByRef(result, "genderCategoriesList");
    const item = list.props.renderItem({ item: PROPS.categories[0] });
    expect(item.key).toEqual(PROPS.categories[0].value);
    expect(item.props).toEqual(PROPS.categories[0]);

    expect(item).toMatchSnapshot();
  });

  it("should render to snapshot", () => {
    expect(
      renderWithLayout(<Component {...PROPS} />, null, true)
    ).toMatchSnapshot();
  });
});
