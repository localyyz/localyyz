#!/bin/bash

echo "releasing $FASTLANE_ENV"

if test `find "${FASTLANE_ENV}_CHANGELOG.md" -mmin +5`; then
  echo "please update the CHANGELOG";
  exit 1
fi
