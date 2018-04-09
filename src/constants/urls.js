/*global __DEV__:true*/

const forcedProd = false;

const prod_api_url = "https://api.localyyz.com";
const dev_api_url = "http://localhost:5331";

export const API_URL = __DEV__ && !forcedProd ? dev_api_url : prod_api_url;
