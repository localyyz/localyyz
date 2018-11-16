// third party
import { observable, computed, action, runInAction } from "mobx";
import { Animated } from "react-native";

// custom
import { Colours } from "~/src/constants";
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
  @box canFinish = false;

  // fetched for styles questions slide
  @observable styles = [];

  onboard = [
    {
      id: "save",
      line1: "Welcome to Localyyz",
      line2: "Save up to 80% on designer fashion.",
      line3:
        "We keep you in the know via push notifications on thousands of sale items.",
      imageSrc: "",
      iconSrc: "price-tag",
      backgroundColor: Colours.SkyBlue,
      skippable: true
    },
    {
      id: "discount",
      line1: "Discover offers with ease.",
      line2: "Updated daily from hundreds of stores.",
      line3:
        "Tired of waiting for a discount code? Easily browse hundreds all in one place.",
      imageSrc: "",
      iconSrc: "wallet",
      backgroundColor: Colours.RoseRed,
      skippable: true
    },
    {
      id: "discover",
      line1: "Shop top brands and styles.",
      line2: "From 100s of stores around the world.",
      line3:
        "Discover hand curated brands from New York, Los Angeles, Paris and London all in one app.",
      imageSrc: "",
      iconSrc: "globe",
      backgroundColor: Colours.UltraViolet,
      skippable: true
    },
    {
      id: "personalize",
      line1: "We are your personal shopper.",
      line2: "Discover the perfect look tailored just for you.",
      line3:
        "We know everyone is different, that's why use the power of machine learning to learn and adapt Localyyz to your unique style.",
      iconSrc: "user",
      backgroundColor: Colours.FloridaOrange,
      skippable: true
    },
    {
      id: "questions",
      line1: "Ready to go?",
      line2: "Complete the style quiz.",
      line3:
        "Answer a few questions to help us personalize the home feed for you.",
      iconSrc: "question-answer",
      iconTyle: "MaterialIcons",
      backgroundColor: Colours.FloridaOrange,
      skippable: true
    }
  ];

  questions = [
    {
      id: "pricing",
      title: "What's your price range?",
      info:
        "Select the price ranges you are interested in, this will help us filter the app and send you savings based on your selection",
      data: [
        {
          id: 21,
          label: "Smart Shopper",
          key: "pricing",
          value: "low",
          desc:
            "You're a smart shopper. You usually spend less than $50 on most of your purchases.",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/smart.jpeg?1796429249853876044"
        },
        {
          id: 22,
          label: "Quality Hunter",
          key: "pricing",
          value: "medium",
          desc:
            "You like to showcase your sense of style, and not afraid to spend a little more. Usually your purchases are between $50-$200.",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/medium.jpeg?1796429249853876044"
        },
        {
          id: 23,
          label: "Luxury Lover",
          key: "pricing",
          value: "high",
          desc:
            "You love everything luxury and big name brands. Usually you spend more than $200.",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/luxury.jpeg?1796429249853876044"
        }
      ]
    },
    {
      id: "gender",
      title: "Which is your preferred category?",
      info:
        "Select a category you are most interested in, this will help us filter the app based on your selection",
      data: [
        {
          id: 20000,
          key: "gender",
          value: "woman",
          label: "Women",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0052/8731/3526/files/Women_Fashion.jpg?2201626930138486138"
        },
        {
          id: 10000,
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
      info:
        "Select the styles you are interested in, this will help us filter the app and send you savings based on your selection",
      fetchPath: "/categories/styles"
    },
    {
      id: "sort",
      title: "How would you like to prioritize your feed?",
      info:
        "Select what products you like to see first, this will help us filter the app and send you savings based on your selection",
      data: [
        {
          id: 30000,
          key: "sort",
          value: "newest",
          label: "Newest Products",
          desc: "Always show me the newest products first.",
          backgroundColor: Colours.FirstGradient
        },
        {
          id: 40000,
          key: "sort",
          value: "trending",
          label: "Trending Products",
          desc: "Always show me what's most trending first.",
          backgroundColor: Colours.Accented
        },
        {
          id: 50000,
          key: "sort",
          value: "bestselling",
          label: "Best Selling",
          desc: "Show me what's selling the best first.",
          backgroundColor: Colours.Secondary
        },
        {
          id: 60000,
          key: "sort",
          value: "bestdeal",
          label: "Best Deals",
          desc: "Show me the best deals first.",
          backgroundColor: Colours.Positive
        }
      ]
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

  @action
  fetchStyles = async path => {
    this.styles.clear();
    const resolved = await ApiInstance.post(path, this.selectedToParams);
    runInAction("[ACTION] fetch styles", () => {
      if (!resolved.error) {
        this.styles = resolved.data.map(s => ({
          ...s,
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
