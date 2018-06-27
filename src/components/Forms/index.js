// local
import {
  BaseField,
  Field,
  Button,
  GoogleAddress,
  Picker,
  Section
} from "./components";
import FormStore from "./store";

// one exportable object
let Forms = {
  BaseField: BaseField,
  Field: Field,
  Button: Button,
  GoogleAddress: GoogleAddress,

  // alias
  Address: GoogleAddress,
  Picker: Picker,
  Section: Section,
  Store: FormStore
};
export default Forms;

// and store separately
export { FormStore };
