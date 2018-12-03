const fs = require('fs')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

const PLAYERS = require('../data/players-data')

const onPlayerListRoute = async function (req, res) {
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

const onDefaultRoute = async function (req,res) {
    //async - await
    try {
        const html = await readFileAsync('views/default.html', 'utf8');
        return html;
    } catch (err) {
        throw err;
    }
}

// Nếu mún gom lại 1 nơi xài: module.exports
module.exports = {
    //onDefaultRoute: onDefaultRoute
    // [ES6] Object property shortcut

    onDefaultRoute,
    onPlayerListRoute,
}
