import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Sizes, Styles } from "localyyz/constants";

export default class StaggeredList extends React.Component {
  constructor(props) {
    super(props);

    // split the children into two lists
    let splitChildren = split(props.children);
    this.state = {
      left: this.props.left || splitChildren[0],
      right: this.props.right || splitChildren[1]
    };
  }

  UNSAFE_componentWillReceiveProps(next) {
    if (next.children) {
      const current = React.Children.map(this.props.children, child => child);
      const future = React.Children.map(next.children, child => child);

      // check if child list has changed, if has, then rebuild the list
      if (!isEqual(current, future)) {
        let splitChildren = split(future);
        this.setState({
          left: this.props.left || splitChildren[0],
          right: this.props.right || splitChildren[1]
        });
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.left}>
          {this.state.left && this.state.left.length > 0
            ? this.state.left
            : null}
        </View>
        <Animated.View
          style={[
            styles.right,
            this.props.offset != null && {
              marginTop: this.props.offset
            }
          ]}
        >
          {this.state.right && this.state.right.length > 0
            ? this.state.right
            : null}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    alignItems: "flex-start"
  },

  left: {
    flex: 1,
    marginRight: Sizes.InnerFrame / 2
  },

  right: {
    flex: 1,
    marginTop: Sizes.InnerFrame * 6,
    marginLeft: Sizes.InnerFrame / 2
  }
});

function split(list) {
  let first = [];
  let second = [];

  // collapse into array
  list = React.Children.map(list, child => child);

  // split the list as staggered (odd and even in their own lists)
  if (list) {
    for (let i = 0; i < list.length; i++) {
      ((i + 2) % 2 == 0 ? first : second).push(list[i]);
    }
  }

  return [first, second];
}

function isEqual(first, second) {
  if (!!first && !!second && first.length === second.length) {
    for (let firstItem of first) {
      if (!second.find(secondItem => secondItem.key === firstItem.key)) {
        return false;
      }
    }

    return true;
  }

  return false;
}
