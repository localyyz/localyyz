# Deploying Android

./gradlew assembleRelease

../android/app/build/outputs/apk/release


# codepush

use -d for Production/Staging
use -m for manditory update

appcenter codepush release-react --app Localyyz/Localyyz-iOS -d Production
appcenter codepush release-react --app Localyyz/Localyyz-Android -d Production

# Adding new react native modules

please remember to run `react-native-schemes-manager all` or staging archiving
may not work properly

# Adding new pods

please remember to create the relevant configurations, such as staging on the
project

# Archiving and releasing for Staging

`bundle exec fastlane staging`
