#!/bin/bash

YEAR=2025
COPYRIGHT="Copyright ©${YEAR} Bitburner"
PACKAGER="npx @electron/packager"

# Clear out any files remaining from old builds and recreate folder
rm -rf .package
mkdir .package || exit 2
rm -rf .build
mkdir .build || exit 2

# Install electron sub-dependencies
cd electron || exit 2
npm install || exit 2
cd ..

# .app should have the fully built game already after npm run build
if [ -d .app ]; then
  cp -r .app/* .package || exit 2
else
  echo "Need to build app first. npm run build" && exit 1
fi
cp -r electron/* .package

packageWin() {
  eval "$(package win32 x64,arm64 .package/icon.ico)"
}

packageLinux() {
  eval "$(package linux x64,arm64)"
}

packageMac() {
  UNI_ARGS='--osx-universal.x64ArchFiles="Contents/Resources/app/node_modules/@catloversg/steamworks.js/dist/osx/*" '
  eval "$(package darwin arm64 .package/icon) ${UNI_ARGS}"
}

package() {
  PLATFORM=$1
  ARCH=$2
  ICON=$3

  if [ -n "$ICON" ]; then     # Only include icon flag if icon file specified
    ICONARG="--icon ${ICON}"
  else
    ICONARG=""
  fi

  echo "${PACKAGER} .package bitburner --platform ${PLATFORM} --arch ${ARCH} --overwrite --out .build ${ICONARG} --app-copyright ${COPYRIGHT}"
}

BUILD_PLATFORM=${1:-"all"}
# And finally build the app.
case $BUILD_PLATFORM in
  "win")
    packageWin;;
  "linux")
    packageLinux;;
  "mac")
    packageMac;;
  *)
    packageWin;
    packageLinux;
    packageMac;;
esac

# Cleanup temporary files
## rm -rf .package
