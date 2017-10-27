const _ = require('lodash')
const fs = require('fs')
const path = require('path')
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

    for (var e = 0; e < entities.length; e++) {
        let photos = _.get(entities, [e, 'photo'], [])
        let entityPath = _.get(entities, [e, 'path'])

        if (!Array.isArray(photos)) {
            photos = [photos]
        }

        for (let i = 0; i < photos.length; i++) {
            request({
                url: 'https://api.entu.ee/property/' + photos[i]._id,
                method: 'GET',
                encoding: 'binary',
                'auth': {
                    'bearer': token
                },
                qs: { download: true }
            }, (error, response, body) => {
                if (error) { console.error(error) }
                if (response.statusCode !== 200) { console.error(body) }

                if (response && response.headers && response.headers['content-disposition']) {
                    let filename = path.join(PICTURES_DIR, entityPath, response.headers['content-disposition'].replace('inline; filename*=UTF-8\'\'', ''))
                    console.log(filename)
                    fs.writeFileSync(filename, body, 'binary')
                } else {
                    console.log('NO FILE: ', uri)
                }
            })
        }
    }
})
