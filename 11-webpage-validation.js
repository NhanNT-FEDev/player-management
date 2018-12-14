const http = require('http')
const urlLib = require('url')

const { onServerError } = require('./handlers/error-handler-save')
const member = require('./handlers/members-handler-validation')


/*
 * Event listeners
 */

const handleUnexpectedError = (err) => {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)


const HANDLERS = {
    // 'GET /': member.onDefaultRoute,
    // 'GET /members': member.onMemberListRoute,
    // 'GET /member-detail': member.onMemberDetailRoute,
    // 'POST /member-detail': member.onMemberSaveRoute,
    'GET /': member.onDefaultRoute,
    'GET /players': member.onMemberListRoute,
    'GET /player-detail': member.onMemberDetailRoute,
    'POST /player-detail': member.onMemberSaveRoute,
    'POST /player-save': member.onMemberSaveRoute,
}

/**
 * Handles every request to web server
 * @param {http.IncommingMessage} req The request object
 * @param {http.ServerResponse} res The response object
 */
const requestListener = async (req, res) => {
    const { method, url } = req
    const pathname = urlLib.parse(url).pathname
    const route = `${method} ${pathname}`
    const handler = HANDLERS[route]
    console.log(route);
    
    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', handleUnexpectedError)

    let response = ''
    try {
        response = await handler(req)
    }
    catch (err) {
        response = await onServerError(err)
    }
    finally {
        const headers = Object.assign(
            { 'Content-Type': 'text/html' },
            response.headers
        )

        res.writeHead(response.status, headers)
        res.end(response.content)
    }
}


http.createServer()
    .on('request', requestListener)
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Web Server error:', err)
    })
    .listen(3000)