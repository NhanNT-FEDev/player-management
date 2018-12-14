const http = require('http')
const urlLib = require('url')
// const util = require('util')

// const errorExports = require('./handlers/error-handler');
// const serversideErrorExports = require('./models/ServersideError');

const { onErrorRoute } = require('./handlers/error-handler'); // Destructing ES6
const players = require('./handlers/player-handler');

// const readFileAsync = util.promisify(fs.readFile)

const onUnhandledError = function (err) {
    console.error('Unhandled error: ', err);
    process.exit();
}

// Catch all unhandled exception
process.on('uncaughtException', onUnhandledError);

// Catch all unhandled Promise rejection
process.on('unhandledRejection', onUnhandledError);


const HANDLERS = {
    'GET /': players.onDefaultRoute,
    'GET /players': players.onPlayerListRoute,
    'GET /player-detail-mat': players.onPlayerDetailRoute
    

}
const requestListener = async function(req, res) {
    const { method, url } = req
    const pathname = urlLib.parse(url).pathname
    const route = `${method} ${pathname}`
    console.log({ route })
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }
    let content = '';
    try {
        content = await handler(req, res);
    } catch (error) {
       try {
           content = await onErrorRoute(error);
       } catch (error) {
           console.error('Error Page....: ', error);
           res.writeHead(500);
           
       } 
    } finally {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.write(content);
        res.end();
    }
}

// 1. Create a EADDRINUSE error
// http.createServer().listen(3000)

http.createServer()
    .on('request', requestListener)
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Web Server error:', err)
    })      
    .listen(3000)