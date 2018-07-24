// third party
import { observable, runInAction, computed } from "mobx";
import Moment from "moment";

// custom
import { box } from "localyyz/helpers";
import { ApiInstance } from "localyyz/global";
import { Deal } from "localyyz/models";

// constants
const DEBUG = false;
const ENDPOINT = "deals";
const MIN_SYNC_INTERVAL = 1000;
const MAX_SYNC_INTERVAL = 10000;
const FEATURED_LIMIT = 3;

export default class DealsUIStore {
  @observable active = [];
  @observable upcoming = [];
  @observable missed = [];
  @observable now = Moment();

  // is the top deals tab focused?
  // this syncs up active cards and lets them
  // know to stop refreshing
  @box isFocused = false;

  constructor() {
    // bindings
    this.fetch = this.fetch.bind(this);
    this.fetchMissed = this.fetchMissed.bind(this);
    this.refresh = this.refresh.bind(this);
    this.equals = this.equals.bind(this);
  }

  activate = ({ dealId, startAt = null, duration = null }) => {
    ApiInstance.post("/deals/activate", {
      dealId: parseInt(dealId, 10),
      duration: parseInt(duration, 10),
      startAt: startAt
    }).then(() => {
      this.fetch();
    });
  };

  async fetch() {
    let activeOrigin = `${ENDPOINT}/active`;
    let upcomingOrigin = `${ENDPOINT}/upcoming`;

    // and fetch
    let active = await ApiInstance.get(activeOrigin);
    let upcoming = await ApiInstance.get(upcomingOrigin);

    if (
      active
      && active.status < 400
      && active.data
      && (upcoming && upcoming.status && upcoming.data)
    ) {
      await runInAction("[ACTION] Fetching today's deals", () => {
        let newActive, newUpcoming;

        // inject origin data for fetching
        newActive = active.data.map(
          deal => new Deal({ ...deal, origin: `${activeOrigin}/${deal.id}` })
        );

        newUpcoming = upcoming.data.map(
          deal => new Deal({ ...deal, origin: `${upcomingOrigin}/${deal.id}` })
        );

        // only trigger update if the lists have changed
        if (!this.equals(this.active, newActive)) {
          this.active = newActive;
        }

        if (!this.equals(this.upcoming, newUpcoming)) {
          this.upcoming = newUpcoming;
        }

        // and out
        return this.deals;
      });
    }
  }

  async fetchMissed() {
    let missedOrigin = `${ENDPOINT}/history`;

    // undefined is fetch origin, null is no pages left
    if (this.nextMissedUri !== null) {
      let missed = await ApiInstance.get(this.nextMissedUri || missedOrigin);
      if (missed && missed.status < 400 && missed.data) {
        runInAction("[ACTION] Fetching missed deals", () => {
          this.nextMissedUri = (missed.link && missed.link.next) || null;
          this.missed = [
            ...this.missed,
            ...missed.data.map(
              deal =>
                new Deal({ ...deal, origin: `${missedOrigin}/${deal.id}` })
            )
          ];
        });

        return this.missed;
      }
    }
  }

  clearTimeout = () => {
    this._refreshTimeout && clearTimeout(this._refreshTimeout);
    this._refreshTimeout = null;
  };

  refresh(interval = 0) {
    this._refreshTimeout = setTimeout(() => {
      runInAction("[ACTION] Syncing deals with current time", () => {
        this.now = Moment();
        this.fetch().then(() => {
          let newInterval = Math.min(
            MAX_SYNC_INTERVAL,
            Math.max(
              Moment(this.currentTimerTargetArray).diff(this.now),
              MIN_SYNC_INTERVAL
            )
          );
          DEBUG && console.log(`[Deals] Next sync in ${newInterval / 1000}s`);

          // start a new cycle based on next deal timer boundary
          this.refresh(newInterval);
        });
      });
    }, interval);
  }

  // compares two lists of deals for equality
  equals(first, second) {
    let lengthTest, signatureTest;
    lengthTest = first.length === second.length;
    signatureTest
      = lengthTest
      && first.map(deal => deal.id).join(",")
        === second.map(deal => deal.id).join(",");

    DEBUG
      && console.log(
        `[Deals] Testing for changes: length ${lengthTest}, signature ${signatureTest}`
      );
    return lengthTest && signatureTest;
  }

  @computed
  get featuredMissed() {
    return [
      ...this.missed.filter(deal => deal.isFeatured).slice(0, FEATURED_LIMIT),
      ...this.missed.filter(deal => !deal.isFeatured).slice(0, FEATURED_LIMIT)
    ].slice(0, FEATURED_LIMIT);
  }

  @computed
  get currentDeal() {
    // merge both active and upcoming
    let activeDeals = this.deals.filter(
      deal => Moment(deal.endAt).diff(this.now) > 0
    );

    // could be null (to indicate no deals active)
    DEBUG
      && console.log(
        `[Deals] Current deal is ${activeDeals[0] && activeDeals[0].id}`
      );
    return activeDeals[0];
  }

  @computed
  get currentStatus() {
    let code = 0;
    let deal = this.currentDeal;
    let start = deal ? Moment(deal.startAt) : null;
    let end = deal ? Moment(deal.endAt) : null;

    // 0-3: [waiting, active, missed, expired]
    if (
      deal
      && start
      && end
      && this.now.diff(start) > 0
      && end.diff(this.now) > 0
    ) {
      code = 1;
    } else if (
      deal
      && start
      && end
      && start.diff(this.now) > 0
      && this.now.format("MMMM Do YYYY") === start.format("MMMM Do YYYY")
    ) {
      code = 0;
    } else if (deal && start && end && start.diff(this.now) > 0) {
      code = 2;
    } else {
      code = 3;
    }

    DEBUG && console.log(`[Deals] Current status is ${code}`);
    return code;
  }

  @computed
  get deals() {
    return [...this.active, ...this.upcoming];
  }

  @computed
  get currentTimerTargetArray() {
    let deal = this.currentDeal;
    let start = deal ? Moment(deal.startAt) : null;
    let end = deal ? Moment(deal.endAt) : null;
    let tomorrowAtNoon = incrementComponent(
      setComponent(this.now.toArray(), 3, 12),
      "d"
    ).slice(0, 4);

    let currentTimer = [
      start && start.toArray(),
      end && end.toArray(),
      tomorrowAtNoon,
      tomorrowAtNoon
    ][this.currentStatus];

    // based off of next timer sync boundary (start and end times)
    DEBUG && console.log(`[Deals] Current timer target is ${currentTimer}`);
    return currentTimer;
  }
}

function incrementComponent(date, component = "m", x = 1) {
  return Moment(date)
    .add(x, component)
    .toArray();
}

function setComponent(date, i, x) {
  return [...date.slice(0, i), x, ...date.slice(i + 1, date.length)];
}
