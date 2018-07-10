jest.mock("react-native-code-push", () => {
  const cp = (_: any) => (app: any) => app;
  Object.assign(cp, {
    InstallMode: {},
    CheckFrequency: {},
    SyncStatus: {},
    UpdateState: {},
    DeploymentStatus: {},
    DEFAULT_UPDATE_DIALOG: {},

    checkForUpdate: jest.fn(),
    codePushify: jest.fn(),
    getConfiguration: jest.fn(),
    getCurrentPackage: jest.fn(),
    getUpdateMetadata: jest.fn(),
    log: jest.fn(),
    notifyAppReady: jest.fn(),
    notifyApplicationReady: jest.fn(),
    sync: jest.fn()
  });
  return cp;
});

jest.mock("react-native-device-info", () => {
  return {
    getBuildNumber: () => 9999,
    getUniqueID: jest.fn()
  };
});

jest.mock("react-native-payments", () => {
  return jest.fn;
});

jest.mock("react-native-google-analytics-bridge", () => {
  return {};
});

jest.mock("react-native-video", () => {
  return "Video";
});
