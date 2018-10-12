// third party
import { observable, computed, action, runInAction } from "mobx";

// custom
import { GA, ApiInstance } from "~/src/global";
import { userStore, Merchant } from "~/src/stores";

export default class Store {
  @observable selected = observable.map({});
  @observable merchants = [];
  @observable isLoading = false;
  @observable slideIndex = 0;

  questions = [
    {
      id: "pricing",
      label: "Q1. What kind of shopper are you?",
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
      label: "Q2: Which category would you like to see more of?",
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
      label: "Q3: Which of these styles best describe you?",
      fetchPath: "/categories/styles"
    },
    {
      id: "sort",
      label: "Q4: Are you also interested...",
      data: [
        {
          id: 30000,
          key: "sort",
          value: "newest",
          label: "Newest Products",
          desc: "Always show me the newest products first."
        },
        {
          id: 40000,
          key: "sort",
          value: "trending",
          label: "Trending Products",
          desc: "Always show me what's most trending first."
        },
        {
          id: 50000,
          key: "sort",
          value: "bestselling",
          label: "Best Selling",
          desc: "Show me what's selling the best first."
        },
        {
          id: 60000,
          key: "sort",
          value: "bestdeal",
          label: "Best Deals",
          desc: "Show me the best deals first."
        }
      ]
    }
  ];

  get favouriteCount() {
    return this.merchants.slice().filter(m => m.isFavourite).length;
  }

  @computed
  get selectedToParams() {
    let params = {};
    for (let s of Array.from(this.selected.values())) {
      params[s.key] = [...(params[s.key] || []), s.value];
    }
    return params;
  }

  @action
  addToSlideIndex = i => {
    this.slideIndex = this.slideIndex + i;
    if (i > 0) {
      GA.trackEvent(
        "personalize",
        "start",
        this.questions[this.slideIndex - 1].id,
        0
      );
    }
  };

  get selectedToQuery() {
    const params = this.selectedToParams;
    return `filter=gender,val=${params.gender}`;
  }

  @action
  toggleLoading = state => {
    this.isLoading = state;
  };

  @action
  fetchMerchants = () => {
    this.next = null;
    this.self = null;
    this.merchants.clear();
    return this.fetchNextPage();
  };

  fetchQuestionData = async path => {
    const resolved = await ApiInstance.post(path, this.selectedToParams);
    if (!resolved.error) {
      return Promise.resolve({ styles: resolved.data });
    }
    return Promise.resolve({ error: resolved.error });
  };

  @action
  fetchNextPage = async () => {
    if (this.isLoading || (this.self && !this.next)) {
      // end of page!
      return;
    }
    this.toggleLoading(true);
    const path = this.next ? this.next.url : "categories/merchants";
    const resolved = await ApiInstance.post(path, this.selectedToParams, {
      limit: 5
    });
    if (!resolved.error) {
      // eslint-disable-next-line
      this.next = resolved.link && resolved.link.next;
      this.self = resolved.link && resolved.link.self;
      runInAction("merchant", () => {
        resolved.data.forEach(m => this.merchants.push(new Merchant(m)));
      });
    }
    this.toggleLoading(false);
    return Promise.resolve({ error: resolved.error });
  };

  @action
  selectOption = option => {
    if (this.selected.get(option.id)) {
      this.selected.delete(option.id);
      GA.trackEvent(
        "personalize",
        "remove",
        `${option.key} - ${option.value}`,
        0
      );
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
    return await userStore.savePreferences(this.selectedToParams);
  };
}
