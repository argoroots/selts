const fs = require('fs')
const op = require('object-path')
const path = require('path')
const request = require('request')
const yaml = require('js-yaml')


const PICTURES_YAML = process.env.PICTURES_YAML
    ? ( path.isAbsolute(process.env.PICTURES_YAML)
            ? process.env.PICTURES_YAML
            : path.join(process.cwd(), process.env.PICTURES_YAML)
      )
    : false


const PICTURES_DIR = process.env.PICTURES_DIR
    ? ( path.isAbsolute(process.env.PICTURES_DIR)
            ? process.env.PICTURES_DIR
            : path.join(process.cwd(), process.env.PICTURES_DIR)
      )
    : false


const download = (uri, dir, callback) => {
    fs.mkdir(dir, function(e) {
        request(uri, {encoding: 'binary'}, (error, response, body) => {
            filename = path.join(dir, response.headers['content-disposition'].replace('inline; filename*=UTF-8\'\'', ''))
            console.log(filename)
            fs.writeFile(filename, body, 'binary', callback)
        })
    })
}


const entities = yaml.safeLoad(fs.readFileSync(PICTURES_YAML, 'utf8'))


for (var e = 0; e < entities.length; e++) {
    var entityId = op.get(entities[e], 'properties.path.values.0.value')

    for (var i = 0; i < op.get(entities[e], 'properties.photo.values', []).length; i++) {
        var fileId = op.get(entities[e], ['properties', 'photo', 'values', i, 'db_value'], '')
        var url = 'https://kunda.entu.ee/api2/file-' + fileId
        download(url, path.join(PICTURES_DIR, entityId + ''), () => {})
    }
}
