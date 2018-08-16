import React from "react";
import { View, StyleSheet } from "react-native";
import { Sizes } from "localyyz/constants";

// custom
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import { observer } from "mobx-react/native";

// local
import { List } from "../../../components";

@observer
export default class StandardCollection extends React.Component {
  render() {
    return (
      <View style={this.props.noMargin ? null : styles.container}>
        {this.props.showImage && this.props.imageUrl ? (
          <Image
            style={{
              width: this.props.imageWidth,
              height: this.props.imageHeight
            }}
            source={{ uri: this.props.imageUrl }}/>
        ) : null}

        <List {...this.props} fetchPath={this.props.fetchFrom} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  }
});
