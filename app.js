'use strict'
require('dotenv').config()
const https = require('https')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'
const port = process.env.PORT
const src = isDev ? './src/index' : './build/index'

// setting to support to used import instead of required
require('@babel/polyfill')
if (isDev) {
  require('@babel/register')
}

const options = {
  key: isDev ? fs.readFileSync(process.env.LOCAL_KEY) : fs.readFileSync(process.env.LIVE_KEY),
  cert: isDev ? fs.readFileSync(process.env.LOCAL_CERT) : fs.readFileSync(process.env.LIVE_CERT),
}
const app = require(src).default

//Here we're assigning the server to a variable because
//we're going to want to manually rip down the server in testing
const server = https.createServer(options, app.callback()).listen(port)

console.log('https://localhost:' + port)
console.log("Running in " + process.env.NODE_ENV + " v" + process.env.NPM_PACKAGE_VERSION)

//Exporting the actual server here for testing availability
module.exports = {server: server}