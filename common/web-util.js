const fs = require('fs')
const path = require('path')
const { parse } = require('querystring')
const urlLib = require('url')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)
const ROOT = process.cwd() // Current proces


/**
 * Creates response object
 * @param {string} content Content returned to client
 * @param {number} status HTTP status code
 * @param {object} headers HTTP headers
 */
function buildResponse(content, status = 200, headers = {}) {
    
    // return { content, status, headers }
    // Object property shotcut: Khi ten property giống với property truyền vào thì chỉ cần ghi 1 cái
    return {
        content: content,
        status: status,
        headers: headers,

    }
}

/**
 * Creates absolute path to public files.
 * @param {string} fileName 
 */
function buildPublicPath(fileName) {
    return path.join(ROOT, 'public', fileName)
}

/**
 * Creates absolute path to view file.
 * @param {string} fileName 
 */
function buildViewPath(fileName) {
    //'views/default.html'
    return path.join(ROOT, 'views', fileName) // join them dấu / tùy theo hệ điều hành.
}

function chooseHandler(handlerMap, method, url) {
    const pathname = urlLib.parse(url).pathname
    const route = `${method} ${pathname}`
        const handler = handlerMap[route]
    for (let [pattern, handler] of handlerMap.entries()) {
        if (route.match(pattern)) {
            return handler
        }
    }
}

/**
 * Builds form data object from request stream.
 * @param {http.IncommingMessage} request 
 */
//Kỹ thuật stream data: Nếu có lỗi thì reject sử lí lỗi, nêu ko thì resovle nối chunk
function extractFormData(request) {
    return new Promise((resolve, reject) => {
        let body = ''
        request
            .on('error', reject)
            .on('data', chunk => {
                body += chunk.toString() // convert Buffer to string
            })
            .on('end', () => {
                resolve(parse(body))
            })
    })
}

/**
 * Reads HTML template from file
 * @param {string} fileName 
 */
function loadHtml(fileName) {
    return readFileAsync(buildViewPath(fileName), 'utf8')
}


/**
 * Gets query string from an URL.
 * 
 * Eg: "http://localhost/path?name=codeschool&from=saigon" => { name: 'codeschool' }
 */
function parseQueryString(url) {
    if (!(typeof url === 'string')) {
        // return null // ??
        return {}
    }

    const queryStr = url.split('?')[1] // name=codeschool&from=saigon
    // console.log({
    //     url,
    //     queryStr: url.split('?') 
    // })
    if (queryStr.length < 2) {
        return {}
    }

    const queryStrParts = queryStr.split('&') // ['name=codeschool', 'from=saigon']
    // console.log({
    //     queryStrParts: queryStr.split('&')
    // })

    const queryObj = queryStrParts
        .map(part => {
            const pair = part.split('=')
            if (pair.length < 2) {
                return {}
            }
            const key = pair[0],
                value = pair[1]
            // const [key, value] = part.split('=')

            return {
                [key]: value
            }
        }) // [{name: 'codeschool'}, {from: 'saigon'}]
        .reduce((prev, cur) => {
            // return Object.assign(prev, cur)
            return {
                ...prev,
                ...cur,
            }
        }, {})

    return queryObj
}

function parseQueryString2(url) {
    const query = urlLib.parse(url).query
    return parse(query)
}

module.exports = {
    buildResponse,
    buildPublicPath,
    buildViewPath,
    chooseHandler,
    extractFormData,
    loadHtml,
    parseQueryString: parseQueryString2,
}
/**
 * public static abc()
 * Product abc = new product 
 * abc.get();
 * 
 * const { abc }  = 
 * 
 */