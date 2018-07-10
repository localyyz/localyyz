import React from "react";
import Renderer from "react-test-renderer";
import Moment from "moment";
import Timer from "../index";

describe("Timer", () => {
  it("Timer: should render properly - basic label", () => {
    let rendered = Renderer.create(<Timer />).getInstance();
    let label = rendered._getBasicLabel({
      seconds: 33,
      minutes: 53,
      hours: 4,
      days: 0
    });
    expect(label).toBe("04:53:33");
  });

  it("Timer: should render properly - detailed label", () => {
    let rendered = Renderer.create(<Timer />).getInstance();
    let detailedLabel = rendered._getDetailedLabel({
      seconds: 33,
      minutes: 53,
      hours: 4,
      days: 0
    });
    expect(detailedLabel).toBe("4 hours, 53 minutes, 33 seconds");
  });

  it("Timer: should call callback when no time left", async () => {
    let props = {
      onComplete: jest.fn(),
      target: Moment().add(1, "seconds")
    };
    Renderer.create(<Timer {...props} />).getInstance();

    jest.mock("Moment", () => ({
      diff: () => 0,
      duration: () => {
        return {
          get: value => {
            return 0;
          }
        };
      }
    }));

    setTimeout(() => {
      expect(props.onComplete).toHaveBeenCalledTimes(1);
    }, 1500);
  });
});
