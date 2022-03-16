#!bin/bash

echo ::set-output name=SOURCE_NAME::${GITHUB_REF#refs/*/}
echo ::set-output name=SOURCE_BRANCH::${GITHUB_REF#refs/heads/}
echo ::set-output name=SOURCE_TAG::${GITHUB_REF#refs/tags/}
export TAG=${GITHUB_REF#refs/tags/}
export TAG_WITHOUT_TYPE=${TAG#app-}
echo ::set-output name=APP_NAME::${TAG_WITHOUT_TYPE%-v*}