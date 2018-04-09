//import { action, computed } from "mobx";

import { User } from "localyyz/models";
import { createViewModel } from "mobx-utils";

export let userStore = createViewModel(new User());
