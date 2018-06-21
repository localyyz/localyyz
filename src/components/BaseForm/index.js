import React from "react";

// custom
import { BaseScene, Forms } from "localyyz/components";

export default class BaseForm extends React.Component {
  static Store = Forms.Store;

  render() {
    return (
      <Forms.Picker.Provider>
        <BaseScene {...this.props} />
      </Forms.Picker.Provider>
    );
  }
}
