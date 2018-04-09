import { observable, action } from "mobx";

// custom
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";

export default class NavigationStore {
  @box cartItemCount = 0;
  @observable appContext;
  @observable isLoaded = false;

  @observable.ref
  navigationState = {
    index: 0,
    routes: [{ key: "Deeplink", routeName: "Deeplink" }]
  };

  constructor() {
    this.api = ApiInstance;
  }

  @action
  countCartItem() {
    this.api.get("/carts/default/items/count").then(response => {
      if (response && response.data) {
        this.cartItemCount = response.data["count"];
      }
    });
  }

  @action
  setLoaded(isLoaded) {
    this.isLoaded = isLoaded != null ? isLoaded : true;
  }

  @action
  decCount() {
    this.cartItemCount = this.cartItemCount - 1;
  }

  @action
  incCount() {
    this.cartItemCount = this.cartItemCount + 1;
  }

  @action
  setAppContext(context) {
    this.appContext = context;
  }

  // NOTE: the second param, is to avoid stacking and reset the nav state
  @action
  dispatch = (router, action, stackNavState = true) => {
    const previousNavState = stackNavState ? this.navigationState : null;

    // deep linking directly to product page
    if (action.routeName == "Product" && !action.params.product) {
      const routes = [
        {
          key: "App",
          routeName: "App",
          index: 0,
          routes: [
            {
              key: "Root",
              routeName: "Root",
              index: 1,
              routes: [
                {
                  key: "Home",
                  routeName: "Home"
                },
                {
                  key: "Product",
                  routeName: "Product",
                  params: action.params
                }
              ]
            },
            {
              key: "History",
              routeName: "History"
            }
          ]
        }
      ];

      this.navigationState = {
        ...previousNavState,
        routes,
        index: routes.length - 1
      };
    } else if (action.type == "tab") {
      let root = previousNavState ? previousNavState.routes : [];
      let tabs = root[0] || {};
      let originalSelectedTab = tabs.index;
      var tabIndex =
        tabs.routes.findIndex(tab => tab.routeName === action.routeName) || 0;

      // rebuild and swap indices at tab level
      this.navigationState = {
        ...previousNavState,
        routes: root.length > 0 && [
          {
            ...tabs,
            index: tabIndex,
            routes:
              tabs.routes.length > 0
                ? [
                    ...tabs.routes.slice(0, tabIndex),

                    // reset tab to tab index if changeTab is conseq pressed
                    tabIndex === originalSelectedTab
                      ? {
                          ...tabs.routes[tabIndex],
                          index: 0,
                          routes: [
                            {
                              ...(tabs.routes[tabIndex].routes &&
                                tabs.routes[tabIndex].routes[0]),
                              params: action.params
                            }
                          ]
                        }
                      : tabs.routes[tabIndex],
                    ...tabs.routes.slice(tabIndex + 1)
                  ]
                : []
          },
          ...root.slice(1)
        ]
      };
    } else {
      this.navigationState = router.getStateForAction(action, previousNavState);
    }

    return this.navigationState;
  };
}
