import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ContentCoverSlider, NavBar } from "localyyz/components";

// third party
import { Provider } from "mobx-react";

// local
import { Featured, Listing } from "./components";
import BrandsStore from "./store";

export default class BrandsScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHeight: 0
    };

    // setup of sections
    this.settings = this.props.navigation.state.params;
    this.sections = [
      {
        type: "featured"
      },
      {
        type: "list"
      }
    ];

    // shared store between listing and featured
    this.store = new BrandsStore(this.settings.type);

    // bindings
    this.renderSection = this.renderSection.bind(this);
  }

  renderSection({ item: section }) {
    let component;
    switch (section.type) {
      case "featured":
        component = (
          <Featured
            path={this.settings.type}
            shouldShowName={this.settings.shouldShowName}/>
        );
        break;
      default:
        component = <Listing path={this.settings.type} />;
        break;
    }

    return component;
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="container"
          title={this.settings.title}
          backAction={() => this.props.navigation.goBack()}
          backColor={Colours.Text}
          background={
            <View
              onLayout={e =>
                this.setState({ headerHeight: e.nativeEvent.layout.height })
              }>
              <View style={[Styles.Card, styles.header]}>
                <Text style={styles.headerLabel}>{this.settings.title}</Text>
                {this.settings.description ? (
                  <Text style={styles.headerDescriptionLabel}>
                    {this.settings.description}
                  </Text>
                ) : null}
              </View>
            </View>
          }>
          <Provider brandsStore={this.store}>
            <FlatList
              data={this.sections}
              keyExtractor={(section, i) => `section-${i}`}
              renderItem={this.renderSection}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={e => this.refs.container.onScroll(e)}
              contentContainerStyle={{
                paddingBottom: NavBar.HEIGHT * 2,
                marginTop: this.state.headerHeight
                  ? this.state.headerHeight - Sizes.InnerFrame
                  : 0
              }}/>
          </Provider>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: NavBar.HEIGHT,
    backgroundColor: Colours.Background
  },

  header: {
    paddingBottom: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame * 4,
    paddingHorizontal: null,
    backgroundColor: Colours.Foreground
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  headerDescriptionLabel: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  }
});
