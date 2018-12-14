const { buildResponse, loadHtml } = require('../common/web-util')
const { ServersideError } = require('../models/ServersideError')


exports.onServerError = async function (err) {
    console.error('Route error:', err)
    const html = await loadHtml('error-mat.html')
    const errMsg = (err instanceof ServersideError
        ? err.message
        : 'Vui lòng liên hệ với admin để được hỗ trợ')
    const content = html.replace('{{reason}}', errMsg)

    return buildResponse(content)
}
