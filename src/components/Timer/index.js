import React from "react";
import { Text } from "react-native";

// third party
import Moment from "moment";
import padStart from "lodash.padstart";

// constants
const DEFAULT_UPDATE_INTERVAL = 1000;

export default class Timer extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this._getBasicLabel = this._getBasicLabel.bind(this);
    this._getDetailedLabel = this._getDetailedLabel.bind(this);
    this.parseTimeLeft = this.parseTimeLeft.bind(this);

    // data
    this.state = {
      label: this.getLabel(this.timeLeft)
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  start() {
    this.stop();
    this._task = setTimeout(() => {
      let left = this.timeLeft;
      this.setState({ label: this.getLabel(left) }, () => {
        if (left > 0) {
          this.start();
        } else {
          // completion callback when timer hits 0, and don't refresh
          this.props.onComplete && this.props.onComplete();
        }
      });
    }, this.props.interval || DEFAULT_UPDATE_INTERVAL);
  }

  stop() {
    this._task && clearTimeout(this._task);
  }

  getLabel(timeLeft) {
    return this.props.isDetailed
      ? this._getDetailedLabel(timeLeft)
      : this._getBasicLabel(timeLeft);
  }

  _getDetailedLabel(timeLeft) {
    return this.parseTimeLeft(timeLeft)
      .map(
        (c, i) =>
          c > 0 ? `${c} ${["days", "hours", "minutes", "seconds"][i]}` : null
      )
      .filter(c => c)
      .join(", ");
  }

  _getBasicLabel(timeLeft) {
    let left = this.parseTimeLeft(timeLeft);

    // remove day if not present
    left = left[0] > 0 ? left : left.slice(1, left.length);

    // remove left leading 0's if requested
    left = this.props.trim
      ? left.slice(left.findIndex(i => i > 0) || 0, left.length)
      : left;

    // padding components
    left = left.map(component => padStart(component, 2, "0"));

    // display separator
    left = left.join(":");
    return left;
  }

  parseTimeLeft(timeLeft) {
    let d = Moment.duration(timeLeft);
    d = [d.get("days"), d.get("hours"), d.get("minutes"), d.get("seconds")];
    return d;
  }

  get timeLeft() {
    // cap timer to 0, no negative times
    return Math.max(0, Moment(this.props.target).diff(Moment()));
  }

  render() {
    return <Text {...this.props}>{this.state.label}</Text>;
  }
}
