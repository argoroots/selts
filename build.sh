#!/bin/bash

# set -o errexit -o nounset

export SOURCE_DIR=./source
export TMP_SOURCE_DIR=./tmp_source
export BUILD_DIR=./build

export ENTU_DB=kunda
# export ENTU_DB=
# export ENTU_KEY=


# before_script:
echo
echo --------- PREFETCH
rm -rf ${TMP_SOURCE_DIR}
mkdir ${TMP_SOURCE_DIR}
cp -r ${SOURCE_DIR}/* ${TMP_SOURCE_DIR}

rm -rf ${BUILD_DIR}
mkdir ${BUILD_DIR}

rm -rf ${BUILD_DIR}/assets
mkdir -p ${BUILD_DIR}/assets
cp -r ./assets/* ${BUILD_DIR}/assets

rm -r node_modules
npm install entu-ssg


# script:
echo
echo --------- FETCH
export ENTU_TYPE=news
# export ENTU_PARENT=743
./node_modules/entu-ssg/helpers/entu2yaml.js ${TMP_SOURCE_DIR}/uudised/_uudis/data.yaml


echo
echo --------- BUILD
./node_modules/entu-ssg/build.js ./entu-ssg.yaml


echo
echo --------- PICTURES
export TMP_SOURCE_DIR=./tmp_source
export PICTURES_YAML=${TMP_SOURCE_DIR}/uudised/_uudis/data.yaml
export PICTURES_DIR=${BUILD_DIR}
node ./pictures.js
