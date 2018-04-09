//import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'

//var { RNLocation: Location } = require('NativeModules');

//const gps = {
//setup: (fn, options = {}) => {
//BackgroundGeolocation.configure({
//// basic configs
//desiredAccuracy: 100,
//stationaryRadius: 10,
//distanceFilter: 10,
////debug: __DEV__,
//stopOnTerminate: false,

//// Android configs
////startOnBoot: false,
////interval: 10000,
////fastestInterval: 5000,
////locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
////activitiesInterval: 10000,
////stopOnStillActivity: false,

//// post to server
////url: `${API_URL}/session/heartbeat`,
////httpHeaders: {
////'Authorization': `BEARER ${options.jwt}`,
////}
//}, fn)
//},
//onLocationUpdate: (fn) => {
//BackgroundGeolocation.on('location', fn)
//},

//onStationary: (fn) => {
//BackgroundGeolocation.on('stationary', fn)
//},

//onError: (fn) => {
//BackgroundGeolocation.on('error', fn)
//},

//start: (fn) => {
//BackgroundGeolocation.start(fn)

//},

//getAuthorizationStatus: (fn) => {
//Location.getAuthorizationStatus(fn)
//},

//showAppSettings: () => {
//BackgroundGeolocation.showAppSettings();
//},

//}

//export default gps
