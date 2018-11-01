import { observable, action, computed } from "mobx";

// constants
const BUILTIN_VALIDATORS = {
  isRequired: value => (!!value && value != "") || "This field is required"
};

export default class FormUIStore {
  // rules is array of string (isRequired, etc)
  // rest are either string keys for fields or entire field objects (req id)
  constructor(...fields) {
    // bindings
    this.update = this.update.bind(this);
    this.merge = this.merge.bind(this);
    this.getError = this.getError.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.addCallback = this.addCallback.bind(this);

    // schema for tracked fields in a form, should all contain the following
    // common props (some of which are optional):
    //
    // { id: str,
    //   value?: any,
    //   validators?: [ built-in validator str name or value => returning true or an error message, .. ],
    //   mask?: value => applied mask to value,
    //   onValueChange?: value => callback if value passed validators and changed
    // }

    // shorthand field with no validators or any settings, but still want to track
    // values can just use a str representing the id instead of a full schema
    // object

    // field specific props (not all form field components may support all these)
    //
    // { error?: str cleared on edit to show on field level error label -- supported by anything that uses Forms.BaseField,
    //   mapping: { address: another tracked field id to sync UserAddress value to,
    //              addressOpt: .. as above,
    //              any UserAddress prop: .. as above,
    //              ...
    //   } -- specific to Forms.GoogleAddress, used to sync UserAddress props to other field values when this field is updated
    // }

    // an example of this data option could look like:
    //
    // this._data = {
    //                streetName: {
    //                              id: "streetName",
    //                              value: "123 Something St.",
    //                              validators: ["isRequired", value => value.length > 3 || "Street name should be longer"],
    //                              onValueChange: value => console.log("Changed to", value)},
    //                city: {
    //                              id: "city",
    //                              error: "Whoops"},
    //                address: {
    //                              id: "address",
    //                              mapping: {
    //                                         address: "streetName",
    //                                         city: "city" -- this isn't actually required, mappings that are one to one can be
    //                                                         omitted and mapped automatically}}}

    this._data = observable(
      Object.assign(
        {},
        ...fields
          .map(field => ({
            value: null,
            validators: [],

            // applies a mask to the value change event
            mask: null,

            // can be either null, single func, or array of func
            onValueChange: null,
            error: null,
            isRequired:
              !!field.validators && field.validators.includes("isRequired"),
            ...(field.id ? field : { id: field })
          }))

          // inject builtin validator (where validator is just a string), and
          // external clearable error
          .map(field => ({
            [field.id]: {
              ...field,
              validators: [
                () => this.getError(field.id) || true,
                ...field.validators
                  .map(
                    validator =>
                      typeof validator === "string"
                      || validator instanceof String
                        ? BUILTIN_VALIDATORS[validator]
                        : validator
                  )

                  // strip out invalid validators
                  .filter(validator => !!validator)
              ]
            }
          }))
      )
    );
  }

  getError(field) {
    return this._data[field] && this._data[field].error;
  }

  @action
  setError(k, message) {
    this._data[k].error = message;
  }

  @action
  clearError(k) {
    this._data[k].error = null;
  }

  @action
  update(k, v) {
    if (this._data[k] != undefined) {
      this._data[k].value = this._data[k].mask ? this._data[k].mask(v) : v;

      // clears external error message on change (usually when typing)
      this.clearError(k);

      // and trigger callback if given
      this._data[k].validators.every(
        validator => validator(this._data[k].value) === true
      ) && this.onValueChange(k, v);
    }
  }

  @action
  addCallback(k, f) {
    let cbs = this._data[k].onValueChange;
    if (!cbs) {
      this._data[k].onValueChange = f;
    } else if (!cbs.forEach) {
      this._data[k].onValueChange = [cbs, f];
    } else {
      this._data[k].onValueChange.push(f);
    }
  }

  onValueChange(k, v) {
    let cbs = (this._data[k] && this._data[k].onValueChange) || null;

    // onValueChange can be either single func or array of funcs
    if (cbs) {
      cbs.forEach ? cbs.forEach(cb => cb(v)) : cbs(v);
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
  get nextField() {
    // get the next incomplete field
    return Object.values(this._data).find(
      field =>
        field.isRequired
        && field.validators.some(validator => validator(field.value) !== true)
    );
  }

  @computed
  get data() {
    return Object.assign(
      {},
      ...Object.keys(this._data).map(key => ({
        [key]:
          // force clearable error to show even if value wasn't set
          this._data[key].error && this._data[key].value == null
            ? ""
            : this._data[key].value
      }))
    );
  }
}
