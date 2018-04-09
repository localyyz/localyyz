import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

export default class SizeChart extends React.Component {
  renderChart(columns) {
    return (
      <View style={styles.container}>
        {columns.map((column, i) => (
          <View style={styles.column} key={`column-${i}`}>
            <View style={styles.row}>
              <Text style={[styles.text, styles.header]}>{column[0]}</Text>
            </View>
            {column.slice(1).map((size, i2) => (
              <View style={styles.row} key={`column-${i}-${i2}`}>
                <Text style={styles.text}>{`${size}`}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  render() {
    switch (this.props.type) {
      case "shirt":
      case "hooded":
        return this.renderChart([
          ["Size", "XS", "S", "M", "L", "XL", "XXL"],
          ["Collar (cm)", 37, 38, 39, 40, 41, 42],
          ["1/2/3", 0, 1, 2, 3, 4, 5],
          ["US", 34, 36, 38, 40, 42, 44],
          ["Italy (IT)", 44, 46, 48, 50, 52, 54]
        ]);
      case "jean":
      case "pant":
      case "sweatpant":
      case "shorts":
        return this.renderChart([
          ["Waist (inches)", 28, 29, 30, 31, 32, 33, 34, 36],
          ["Size", "XS", "XS", "S", "S", "M", "M", "L", "XL"],
          ["US", 36, 36, 38, 38, 40, 40, 42, 44],
          ["Italy (IT)", 44, 44, 46, 46, 48, 48, 50, 52],
          ["France (FR)", 36, 36, 38, 38, 40, 40, 42, 44]
        ]);
      case "sneaker":
      case "shoe":
      case "flat":
      default:
        return this.renderChart([
          [
            "Italy (IT)",
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            39.5,
            40.5,
            41.5,
            42.5,
            43.5,
            44.5
          ],
          ["US", 6, 7, 8, 9, 10, 11, 12, 13, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5],
          [
            "United Kingdom (UK)",
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            5.5,
            6.5,
            7.5,
            8.5,
            9.5,
            10.5
          ]
        ]);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  column: {},

  row: {
    marginVertical: Sizes.InnerFrame / 2
  },

  text: {
    ...Styles.Text
  },

  header: {
    ...Styles.Emphasized
  }
});
