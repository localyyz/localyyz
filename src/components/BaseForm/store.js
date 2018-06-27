import { observable, action, computed } from "mobx";

// constants
const BUILTIN_VALIDATORS = {
  isRequired: value => (!!value && value != "") || "This field is required"
};

export default class FormUIStore {
  // rules is array of string (isRequired, etc)
  // rest are either string keys for fields or entire field objects (req id)
  constructor(...fields) {
    this._data = observable(
      Object.assign(
        {},
        ...fields
          .map(field => ({
            value: null,
            validators: [],
            isRequired:
              !!field.validators && field.validators.includes("isRequired"),
            ...(field.id ? field : { id: field })
          }))

          // inject builtin validator (where validator is just a string)
          .map(field => ({
            [field.id]: {
              ...field,
              validators: field.validators
                .map(
                  validator =>
                    typeof validator === "string" || validator instanceof String
                      ? BUILTIN_VALIDATORS[validator]
                      : validator
                )

                // strip out invalid validators
                .filter(validator => !!validator)
            }
          }))
      )
    );

    // bindings
    this.update = this.update.bind(this);
    this.merge = this.merge.bind(this);
  }

  @action
  update(k, v) {
    if (this._data[k] != undefined) {
      this._data[k].value = v;

      // and trigger callback if given
      this._data[k].validators.every(validator => validator(v) === true)
        && this._data[k].onValueChange
        && this._data[k].onValueChange(v);
    }
  }

  merge(data) {
    Object.keys(data).forEach(key => this.update(key, data[key]));
  }

  @computed
  get isComplete() {
    return Object.values(this._data).every(field =>
      field.validators.every(validator => validator(field.value) === true)
    );
  }

  @computed
  get data() {
    return Object.assign(
      {},
      ...Object.keys(this._data).map(key => ({ [key]: this._data[key].value }))
    );
  }
}
