import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// custom
import { ApiInstance } from "localyyz/global";
import { Colours, Sizes } from "localyyz/constants";

// third party
import { withNavigation } from "react-navigation";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { lazyObservable } from "mobx-utils";

// local
import Brand from "./components/Brand";
import Card from "../Card";
import MoreFooter from "../../components/MoreFooter";

@withNavigation
@observer
export default class Brands extends React.Component {
  @observable brands;

  constructor(props) {
    super(props);

    // setup the items
    this.brands = lazyObservable(sink =>
      ApiInstance.get(`${this.props.type}/featured`, {
        limit: this.props.limit
      }).then(response => sink(response.data || []))
    );

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.onPressShowMore = this.onPressShowMore.bind(this);
  }

  renderItem({ item }) {
    return (
      <Brand
        title={item.name || item.id}
        imageUri={item.imageUrl}
        fetchPath={`${this.props.type}/${item.id || item.name}/products`}
        shouldShowName={this.props.shouldShowName}/>
    );
  }

  onPressShowMore() {
    this.props.navigation.navigate("Brands", this.props);
  }

  get brandsWithLogos() {
    let brands = (this.brands.current() || []).filter(brand => brand.imageUrl);
    return brands.slice(0, this.props.limit || brands.length);
  }

  render() {
    let brands = this.brandsWithLogos;

    return brands.length > 0 ? (
      <View style={styles.container}>
        <Card title={this.props.title}>
          <View style={styles.content}>
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={3}
              renderItem={this.renderItem}
              data={brands}
              keyExtractor={(e, i) => `brand-${i}`}/>
          </View>
        </Card>
        <MoreFooter
          title={this.props.title}
          description={this.props.description}
          onPress={this.onPressShowMore}
          numProducts={this.props.numBrands}/>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.InnerFrame / 2
  },

  content: {
    backgroundColor: Colours.Foreground
  }
});
