import { AsyncStorage } from "react-native"
import moment from "moment"

const save = (key, value) => {
  const cache = {
    ...value,
    cachedAt: moment().unix()
  }
  return AsyncStorage.setItem(key, JSON.stringify(cache))
}

const load = async key => {
  const value = await AsyncStorage.getItem(key)

  if (value) {
    return JSON.parse(value)
  } else {
    return null
  }
}

const remove = key => {
  return AsyncStorage.removeItem(key)
}

export default {
  save,
  load,
  remove
}
