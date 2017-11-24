const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const async = require('async')
const request = require('request')
const yaml = require('js-yaml')


const ENTU_DB = process.env.ENTU_DB
const ENTU_KEY = process.env.ENTU_KEY

const FILES_YAML = process.env.FILES_YAML
    ? ( path.isAbsolute(process.env.FILES_YAML)
            ? process.env.FILES_YAML
            : path.join(process.cwd(), process.env.FILES_YAML)
      )
    : false

const FILES_DIR = process.env.FILES_DIR
    ? ( path.isAbsolute(process.env.FILES_DIR)
            ? process.env.FILES_DIR
            : path.join(process.cwd(), process.env.FILES_DIR)
      )
    : false


const entities = yaml.safeLoad(fs.readFileSync(FILES_YAML, 'utf8'))


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
        let files = _.get(entity, 'files', [])

        if (!Array.isArray(files)) {
            files = [files]
        }

        async.each(files, (f, callback) => {
            request({
                url: 'https://api.entu.ee/property/' + f._id,
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
                    let filename = path.join(FILES_DIR, f._id, f.filename)
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
