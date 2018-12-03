const fs = require('fs')
const util = require('util')

// 
const readFileAsync = util.promisify(fs.readFile);

//OPT 1: 
// Object destructuring: Dùng để lấy nhanh 1 property
// const serverSideErrorExports = require('../models/ServersideError');
// const errServer = serverSideErrorExports.ServersideError;

//OPT 2:
const { ServersideError } = require('../models/ServersideError');

exports.onErrorRoute = async function (err) {
    console.error('Route error:', err)
    const html = await readFileAsync('Views/error.html', 'utf8')
    const errMsg = (err instanceof ServersideError
        ? err.message
        : '')
    const content = html.replace('{{reason}}', errMsg)
    return content
    
}