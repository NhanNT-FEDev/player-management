const fs = require('fs')
const http = require('http')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

class ServersideError extends Error {
}

const PLAYERS = [
    { name: 'Hoàng Anh', age: 18 },
    { name: 'Tấn Đạt', age: 18 },
    { name: 'Minh Mẫn', age: 18 },
    { name: 'Bảo Nam', age: 18 },
    { name: 'Trung Nhân', age: 18 },
    { name: 'Quốc Trung', age: 18 },
    { name: 'Nguyễn Tú', age: 18 },
    { name: 'Phạm Tú', age: 18 },
]

const onDefaultRoute = async function (req,res) {
    // return readFileAsync('views/default.html', 'utf8')
    //     .then(html => {
            
    //     }).catch(err => {
    //         return err;
    //     })

    //async - await
    try {
        const html = await readFileAsync('views/default.html', 'utf8');
        return html;
    } catch (err) {
        throw err;
    }
}

const onMemberListRoute = async function (req,res) {
    // 3. Throw a custom general error
    // throw new ServersideError('Custom general error')

    const html = await readFileAsync('Views/players-list.html', 'utf8');
    let rows = '';
    if (PLAYERS.length == 0) {
        rows = '<tr><td>NO DATA</td></tr>'
    } else {
        rows = PLAYERS
        .map(mem => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')    
    }
    
    
    const content = html.replace('{{row}}', rows);
    return content;
   
}

const onError = async function (err) {
    console.error('Route error:', err)
    const html = await readFileAsync('Views/error.html', 'utf8')
    const errMsg = (err instanceof ServersideError
        ? err.message
        : '')
    const content = html.replace('{{reason}}', errMsg)
    return content
    
}

const requestListener = async (req, res) => {
    const { method, url } = req
    const route = `${method} ${url}`
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
           content = await onError(error);
       } catch (error) {
           console.error('Error Page....');
           res.writeHead(500);
           
       } 
    } finally {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.write(content);
        res.end();
    }
})




const HANDLERS = {
    'GET /': onDefaultRoute,
    'GET /players': onMemberListRoute,
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