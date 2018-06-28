// third party
import { observable, runInAction, computed } from "mobx";
import Moment from "moment";

// custom
import { ApiInstance } from "localyyz/global";

// constants
const DEBUG = true;
const DEBUG_DATE_COMPONENT = "s";
const DEBUG_REMAINING = 5;
const DEBUG_DURATION = 1000;
const MIN_SYNC_INTERVAL = 1000;
const MAX_SYNC_INTERVAL = 60000;

// static constants
let DEBUG_DEAL_START, DEBUG_DEAL_END;
// DEBUG_DEAL_START = [2018, 6, 5, 12];
// DEBUG_DEAL_END = [2018, 6, 5, 13];

export default class DealsUIStore {
  @observable deals = [];
  @observable now = Moment();

  constructor() {
    // bindings
    this.fetch = this.fetch.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  refresh(interval = 0) {
    this._refreshTimeout && clearTimeout(this._refreshTimeout);
    this._refreshTimeout = setTimeout(() => {
      runInAction("[ACTION] Syncing deals with current time", () => {
        this.now = Moment();
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
    }, interval);
  }

  @computed
  get currentDeal() {
    let activeDeals = this.deals.filter(
      deal => Moment(deal.end).diff(this.now) > 0
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
    let start = deal ? Moment(deal.start) : null;
    let end = deal ? Moment(deal.end) : null;

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
  get currentTimerTargetArray() {
    let deal = this.currentDeal;
    let start = deal ? Moment(deal.start) : null;
    let end = deal ? Moment(deal.end) : null;
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

  async fetch() {
    let response = await ApiInstance.get("collections");
    if (response && response.status < 400 && response.data) {
      let now = Moment();

      runInAction("[ACTION] Fetching today's deals", () => {
        this.deals
          = response.data.map((deal, i) => ({
            ...deal,

            // TODO: polyfill start and end on debug (remove when backend supports it)
            start: DEBUG
              ? DEBUG_DEAL_START
                || incrementComponent(
                  now.toArray(),
                  DEBUG_DATE_COMPONENT,
                  DEBUG_REMAINING * (i + 1)
                )
              : deal.start,
            end: DEBUG
              ? DEBUG_DEAL_END
                || incrementComponent(
                  now.toArray(),
                  DEBUG_DATE_COMPONENT,
                  (DEBUG_REMAINING + DEBUG_DURATION) * (i + 1)
                )
              : deal.end,
            limit: 100
          })) || [];

        // force timer update
        this.refresh(10);
      });
    }
  }
}

// for dev dummy data starting right soon
function incrementComponent(date, component = "m", x = 1) {
  return Moment(date)
    .add(x, component)
    .toArray();
}

function setComponent(date, i, x) {
  return [...date.slice(0, i), x, ...date.slice(i + 1, date.length)];
}
