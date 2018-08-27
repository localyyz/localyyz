import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  store: stores.filterStore,
  asyncFetch: () => {},
  setFilter: () => {},
  clearFilter: () => () => {},
  selected: ""
}))
@observer
export class FilterButton extends React.Component {
  onPress = () => {
    this.props.navigation.push("Filter", {
      title: "Filter",
      store: this.props.store
    });
  };

  render() {
    const title = this.props.store.numFilters
      ? `Filter (${this.props.store.numFilters})`
      : "Filter";

    return (
      <Common
        title={title}
        icon="playlist-add"
        id="filter"
        onPress={this.onPress}
        {...this.props}/>
    );
  }
}

@inject(stores => ({
  store: stores.filterStore,
  selected: stores.filterStore.merchant,
  setFilter: stores.filterStore.setMerchantFilter,
  asyncFetch: stores.filterStore.fetchMerchants,
  clearFilter: () => stores.filterStore.setMerchantFilter()
}))
@observer
export class Merchants extends React.Component {
  render() {
    return <Common {...this.props} id="merchants" title="Stores" />;
  }
}

@inject(stores => ({
  discountMin: stores.filterStore.discountMin,
  setFilter: stores.filterStore.setDiscountFilter,
  store: stores.filterStore,
  asyncFetch: () => {},
  clearFilter: () => () => {}
}))
@observer
export class Discounts extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        id="discounts"
        title="Sales & Deals"
        scene="FilterDiscountList"
        selectedValue={{
          min: this.props.discountMin
        }}
        selected={
          this.props.discountMin
            ? `${this.props.discountMin}% off or more`
            : null
        }
        asyncFetch={() => {}}/>
    );
  }
}

@inject(stores => ({
  priceMin: stores.filterStore.priceMin,
  priceMax: stores.filterStore.priceMax,
  setFilter: stores.filterStore.setPriceFilter,
  store: stores.filterStore,
  asyncFetch: () => {},
  clearFilter: () => () => {}
}))
@observer
export class Price extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        id="prices"
        title="price"
        scene="FilterPriceList"
        selectedValue={{
          min: this.props.priceMin,
          max: this.props.priceMax
        }}
        selected={
          this.props.priceMin !== undefined && this.props.priceMax !== undefined
            ? this.props.priceMax !== undefined
              ? `$${this.props.priceMin} - $${this.props.priceMax}`
              : `$${this.props.priceMin}+`
            : null
        }
        asyncFetch={() => {}}/>
    );
  }
}

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchBrands,
  setFilter: stores.filterStore.setBrandFilter,
  clearFilter: () => stores.filterStore.setBrandFilter(),
  selected: stores.filterStore.brand
}))
@observer
export class Brands extends React.Component {
  render() {
    return <Common title="brand" id="brands" {...this.props} />;
  }
}

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchColors,
  setFilter: stores.filterStore.setColorFilter,
  clearFilter: () => stores.filterStore.setColorFilter(),
  selected: stores.filterStore.color
}))
@observer
export class Colors extends React.Component {
  render() {
    return <Common title="color" id="colors" {...this.props} />;
  }
}

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchSizes,
  setFilter: stores.filterStore.setSizeFilter,
  clearFilter: () => stores.filterStore.setSizeFilter(),
  selected: stores.filterStore.size
}))
@observer
export class Sizes extends React.Component {
  render() {
    return <Common title="size" id="sizes" {...this.props} />;
  }
}

@inject(stores => ({
  store: stores.filterStore,
  setFilter: stores.filterStore.setCategoryFilter,
  clearFilter: () => stores.filterStore.setCategoryFilter({}),
  category: stores.filterStore.category,
  subcategory: stores.filterStore.subcategory,
  selected: stores.filterStore.subcategory || stores.filterStore.category
}))
@observer
export class Categories extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        data={this.data}
        title="category"
        id="categories"
        scene="FilterCategoryList"
        asyncFetch={this.props.store.fetchCategories}/>
    );
  }
}
