const http = require('http')
const { parse } = require('querystring');

const { buildResponse, extractFormData, loadHtml,
    parseQueryString } = require('../common/web-util')
const MEMBERS = require('../data/members-data-validation')
const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')
const { Member } = require('../models/Member')
const { ServersideError } = require('../models/ServersideError')


exports.onDefaultRoute = async function (req) {
    const html = await loadHtml('default-mat.html')
    return buildResponse(html)
}

exports.onMemberListRoute = async function (req) {
    const rowStr = MEMBERS
        .map((mem, i) => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            <td><a href="/player-detail?id=${i}">Chi tiết</a></td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')

    const html = await loadHtml('player-list-mat.html')
    const content = html.replace('{{row}}', rowStr)
    return buildResponse(content)
}

const buildFacultyList = function (memFaculty) {
    let faStr = '<select name="faculty" class="form-control">'
    faStr += '<option value="">--Chọn chuyên ngành--</option>'

    // for (let hobby in Faculty) { ?
    for (let fac of Object.values(Faculty)) {
        const selected = memFaculty == fac.key ? 'selected' : ''
        faStr += `<option value="${fac.key}" ${selected}>${fac.label}</option>`
    }
    faStr += '</select>'
    return faStr
}

const buildHobbyList = function (memHobbies) {
    memHobbies = memHobbies || []
    let hobStr = ''
    for (let prop in Hobby) {
        const hobby = Hobby[prop]
        const selected = memHobbies.includes(hobby.key) ? 'checked' : ''
        hobStr += `<input type="checkbox" value="${hobby.key}" name="hobbies" id="cb${hobby.key}" ${selected}>`
        hobStr += `<label for="cb${hobby.key}" class="label-check">${hobby.label}</label><br>`
    }
    return hobStr
}

const buildValidationErrorList = function (errors) {
    const errStr = errors.map(e => `<li>${e}</li>`)
    return errStr
}

exports.onMemberDetailRoute = async function (reqOrMember, validationErrors = []) {
    let member, id
    if (reqOrMember instanceof http.IncomingMessage) {
        const queryObj = parseQueryString(reqOrMember.url)
        // console.log({
        //     queryObj })
        id = parseInt(queryObj['id'])
        if (Number.isNaN(id) || !MEMBERS[id]) {
            throw new ServersideError('Mã thành viên không tồn tại')
        }

        member = MEMBERS[id]
    }
    else { // submitted form data
        member = reqOrMember
        id = reqOrMember.id
    }

    // Menu => Convert to async function
    const html = await loadHtml('member-detail-validation.html')

    let content = html
        .replace(new RegExp('{{index}}', 'g'), id)
        .replace('{{error_list}}', buildValidationErrorList(validationErrors))
        .replace('{{hobby_list}}', buildHobbyList(member.hobbies))
        .replace('{{faculty_list}}', buildFacultyList(member.faculty))

    for (let prop in member) {
        let value
        if (prop === 'isGraduated') {
            value = member[prop] ? 'checked' : ''
        }
        else {
            value = member[prop]
        }
        content = content.replace(new RegExp(`{{${prop}}}`, 'g'), value)
    }

    return buildResponse(content)
}

exports.onMemberSaveRoute = async function (req) {
    const formData = await extractFormData(req)

    const member = MEMBERS[formData.id]
    if (!member) {
        return buildResponse(null, 302, {
            'Location': '/',
        })
    }

    const { errors: valErrors, data } = Member.from(formData)
    if (valErrors) {
        return exports.onMemberDetailRoute(formData, valErrors)
    }
    MEMBERS[formData.id] = data

    return exports.onMemberDetailRoute(req)
}