// local
import { BaseField, Field, Button, Section } from "./components";
import FormStore from "./store";

// one exportable object
let Forms = {
  BaseField: BaseField,
  Field: Field,
  Button: Button,

  // alias
  Section: Section,
  Store: FormStore
};
export default Forms;

// and store separately
export { FormStore };
