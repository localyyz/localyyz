/*
 * @flow
 * @providesModule localyyz/tests
 */

export { renderWithLayout, DEFAULT_TEST_LAYOUT } from "./renderWithLayout";

export const findById = (tree, testID) => {
  if (!tree) {
    return;
  } else if (
    tree.testID === testID
    || (tree.props && tree.props.testID === testID)
  ) {
    return tree;
  } else if (tree.props && typeof tree.props.children === "object") {
    return findById(tree.props.children, testID);
  } else if (Array.isArray(tree)) {
    for (let node of tree) {
      let item = findById(node, testID);
      if (typeof item !== "undefined") {
        return item;
      }
    }
  }
};

export const findByKey = (tree, key) => {
  if (tree.key === key) {
    return tree;
  }

  if (tree.props && tree.props.key === key) {
    return tree;
  }

  if (tree.props && typeof tree.props.children === "object") {
    return findByKey(tree.props.children, key);
  }

  if (Array.isArray(tree)) {
    for (let i in tree) {
      let item = findByKey(tree[i], key);
      if (typeof item !== "undefined") {
        return item;
      }
    }
  }
};

export const findByRef = (tree, ref) => {
  if (tree == null) {
    return;
  }

  if (tree.ref === ref) {
    return tree;
  }

  if (tree.props && typeof tree.props.children === "object") {
    return findByRef(tree.props.children, ref);
  }

  if (Array.isArray(tree)) {
    for (let i in tree) {
      let item = findByRef(tree[i], ref);
      if (typeof item !== "undefined") {
        return item;
      }
    }
  }
};
