#!/bin/bash

# set -o errexit -o nounset

export SOURCE_DIR=./source
export TMP_SOURCE_DIR=./tmp_source
export BUILD_DIR=./build

export ENTU_URL=https://kunda.entu.ee


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

npm install entu-cms


# script:
echo
echo --------- FETCH
export E_DEF=news
export PARENT_EID=743
export ITEM_DIR=${SOURCE_DIR}/uudised/_uudis
export ITEM_YAML=uudis.yaml
export OUT_DIR=${TMP_SOURCE_DIR}/uudised
export LIST_YAML=${TMP_SOURCE_DIR}/data/uudised.yaml
./node_modules/entu-cms/helpers/entu2yaml.js

export E_DEF=person
export PARENT_EID=613
export ITEM_DIR=
export ITEM_YAML=
export OUT_DIR=${TMP_SOURCE_DIR}/
export LIST_YAML=${TMP_SOURCE_DIR}/data/asutajad.yaml
./node_modules/entu-cms/helpers/entu2yaml.js

export E_DEF=person
export PARENT_EID=624
export ITEM_DIR=
export ITEM_YAML=
export OUT_DIR=${TMP_SOURCE_DIR}/
export LIST_YAML=${TMP_SOURCE_DIR}/data/juhatus.yaml
./node_modules/entu-cms/helpers/entu2yaml.js

export E_DEF=person
export PARENT_EID=628
export ITEM_DIR=
export ITEM_YAML=
export OUT_DIR=${TMP_SOURCE_DIR}/
export LIST_YAML=${TMP_SOURCE_DIR}/data/liikmed.yaml
./node_modules/entu-cms/helpers/entu2yaml.js

echo
echo --------- PICTURES
export TMP_SOURCE_DIR=./tmp_source
export PICTURES_YAML=${TMP_SOURCE_DIR}/data/uudised.yaml
export PICTURES_DIR=${BUILD_DIR}/uudised
node ./pictures.js

echo
echo --------- BUILD
./node_modules/entu-cms/build.js ./entu-cms.yaml
