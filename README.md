# Deploying Android

./gradlew assembleRelease

../android/app/build/outputs/apk/release


# codepush

use -d for Production/Staging
use -m for manditory update

appcenter codepush release-react --app Localyyz/Localyyz-iOS -d Production
appcenter codepush release-react --app Localyyz/Localyyz-Android -d Production
