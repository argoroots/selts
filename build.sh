#!/bin/bash

# set -o errexit -o nounset


export SOURCE_DIR=./source
export BUILD_DIR=./build

export ENTU_DB=kunda
export ENTU_KEY=28sVbcfZDTRffE3TdccAgCTFZha7rgw3NPNej58tz5YRzjxT


echo
echo --------- PREFETCH
rm -rf ${BUILD_DIR}

mkdir -p ${BUILD_DIR}/assets
mkdir -p ${BUILD_DIR}/uudised
mkdir -p ${BUILD_DIR}/majad
mkdir -p ${BUILD_DIR}/dokumendid

cp -r ./assets/* ${BUILD_DIR}/assets


echo
echo --------- FETCH
export ENTU_QUERY="_type.string=news&props=path.string,date.date,name.string,text.string,photo._id,photo.filename&sort=-date.date"
./node_modules/entu-ssg/helpers/entu2yaml.js ${SOURCE_DIR}/uudised/_uudis/data.yaml

export ENTU_QUERY="_type.string=document&props=name.string,files._id,files.filename"
./node_modules/entu-ssg/helpers/entu2yaml.js ${SOURCE_DIR}/dokumendid/dokumendid.yaml


echo
echo --------- BUILD
npm run build


echo
echo --------- FILES
export FILES_YAML=${SOURCE_DIR}/dokumendid/dokumendid.yaml
export FILES_DIR=${BUILD_DIR}/dokumendid
node ./files.js


echo
echo --------- PICTURES
export PICTURES_YAML=${SOURCE_DIR}/uudised/_uudis/data.yaml
export PICTURES_DIR=${BUILD_DIR}
node ./pictures.js


echo
echo --------- DONE
