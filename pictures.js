const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const async = require('async')
const request = require('request')
const yaml = require('js-yaml')


const ENTU_DB = process.env.ENTU_DB
const ENTU_KEY = process.env.ENTU_KEY

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


const entities = yaml.safeLoad(fs.readFileSync(PICTURES_YAML, 'utf8'))


request({
    url: 'https://api.entu.ee/auth',
    method: 'GET',
    json: true,
    'auth': {
        'bearer': ENTU_KEY
    }
}, (error, response, body) => {
    if (error) { console.error(error) }
    if (response.statusCode !== 200) { console.error(body) }

    let token = _.get(body, [ENTU_DB, 'token'], '')

    async.each(entities, (entity, callback) => {
        let photos = _.get(entity, 'photo', [])
        let entityPath = _.get(entity, 'path')

        if (!Array.isArray(photos)) {
            photos = [photos]
        }

        async.each(photos, (photo, callback) => {
            request({
                url: 'https://api.entu.ee/property/' + photo._id,
                method: 'GET',
                encoding: 'binary',
                'auth': {
                    'bearer': token
                },
                qs: { download: true }
            }, (error, response, body) => {
                if (error) {
                    console.error(error)
                    callback(null)
                } else if (response.statusCode !== 200) {
                    console.error(body)
                    callback(null)
                } else {
                    let filename = path.join(PICTURES_DIR, entityPath, photo.filename)
                    console.log(filename)
                    fs.outputFileSync(filename, body, 'binary')
                    callback(null)
                }
            })
        }, callback)
    }, err => {
        if (err) { console.error(err) }
    })
})
