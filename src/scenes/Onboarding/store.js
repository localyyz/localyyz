// third party
import { observable, computed, action, reaction, runInAction } from "mobx";
import { Animated } from "react-native";
import isEqual from "lodash.isequal";

// custom
import { box } from "~/src/helpers";
import { OS, GA, ApiInstance } from "~/src/global";
import { userStore } from "~/src/stores";

export default class Store {
  @observable selected = observable.map({});
  @observable isLoading = false;
  @box slideIndex = 0;

  // sync up swipers scroll animation
  @box scrollAnimate = new Animated.Value(0);
  @observable scrollDir = "";

  // can finish is controlled by the "outro"
  // check the component for details
  // => this shows/hides the action button
  @box hasPromptedNotf = false;

  // fetched for styles questions slide
  @observable styles = [];

  constructor() {
    if (userStore.prf) {
      this.initializePrf(userStore.prf);
    }
  }

  @action
  initializePrf = prfs => {
    for (let key in prfs) {
      let answers = prfs[key];

      for (let val of answers.slice()) {
        const id = `${key}-${val}`;
        this.selected.set(id, { id: id, key: key, value: val });
      }
    }
  };

  questions = [
    {
      id: "pricing",
      title: "What's your price range?",
      info: "Select all that apply.",
      data: [
        {
          id: "pricing-low",
          label: "Smart Shopper (~$50)",
          key: "pricing",
          value: "low",
          desc:
            "You're a smart shopper. You usually spend less than $50 on most of your purchases."
        },
        {
          id: "pricing-medium",
          label: "Quality Hunter ($50-200)",
          key: "pricing",
          value: "medium",
          desc:
            "You like to showcase your sense of style, and not afraid to spend a little more. Usually your purchases are between $50-$200."
        },
        {
          id: "pricing-high",
          label: "Luxury Lover ($200+)",
          key: "pricing",
          value: "high",
          desc:
            "You love everything luxury and big name brands. Usually you spend more than $200."
        }
      ]
    },
    {
      id: "gender",
      title: "Which is your preferred category?",
      info: "Select all that apply.",
      data: [
        {
          id: "gender-woman",
          key: "gender",
          value: "woman",
          label: "Women",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/Women_Fashion.jpg?2201626930138486138"
        },
        {
          id: "gender-man",
          key: "gender",
          value: "man",
          label: "Men",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/Men_Fashion.jpg?2201626930138486138"
        }
      ]
    },
    {
      id: "style",
      title: "Which of these styles best describe you?",
      info: "Select all that apply."
    },
    { id: "outro", title: "Almost done!" }
  ];

  @computed
  get selectedToParams() {
    let params = {};
    for (let s of Array.from(this.selected.values())) {
      params[s.key] = [...(params[s.key] || []), s.value];
    }
    return params;
  }

  @computed
  get selectedToParamsOS() {
    let osParams = {};
    let params = this.selectedToParams; // iterate over param keys: { "style": [...] } => ["style", "pricing"]
    for (let key of Object.keys(params)) {
      // iterate over param values: [ "artsy", "casual", ...]
      for (let vIndex in params[key]) {
        // get current value index and make new key => { "style1": "artsy", "style2": "casual" }
        osParams[`${key}-${params[key][vIndex]}`] = true;
      }
    }

    return osParams;
  }

  @computed
  get canFinish() {
    return (
      this.hasPromptedNotf
      && this.selectedToParams.pricing
      && this.selectedToParams.gender
      && this.selectedToParams.style
    );
  }

  fetchStyleReaction = reaction(
    () => this.selectedToParams,
    params => {
      if ("pricing" in params && "gender" in params) {
        this.fetchStyles();
      }
    },
    {
      fireImmediately: false,
      delay: 250,
      equals: (from, to) => {
        return (
          isEqual(from.pricing, to.pricing) && isEqual(from.gender, to.gender)
        );
      }
    }
  );

  @action
  fetchStyles = async () => {
    this.styles.clear();
    const resolved = await ApiInstance.post(
      "/categories/styles",
      this.selectedToParams
    );
    runInAction("[ACTION] fetch styles", () => {
      if (!resolved.error) {
        this.styles = resolved.data.map(s => ({
          ...s,
          id: `style-${s.value}`,
          key: "style"
        }));
      }
    });
  };

  @action
  selectOption = option => {
    if (this.selected.get(option.id)) {
      this.selected.delete(option.id);
    } else {
      // select the current category
      GA.trackEvent(
        "personalize",
        "select",
        `${option.key} - ${option.value}`,
        0
      );
      this.selected.set(option.id, option);
    }
  };

  // save preference to user
  saveSelectedOptions = async () => {
    GA.trackEvent("personalize", "finish", "", 0);
    OS.sendTags(this.selectedToParamsOS);
    return await userStore.savePreferences(this.selectedToParams);
  };
}
