const fs = require("fs");
const util = require("util");
const Hobby = require("../models/Hobby.enum");
const Faculty = require("../models/Faculty.enum");
const {
  parseQueryString,
  loadHtml,
  extractFormData, 
  buildResponse
} = require("../common/web-util");
const { ServersideError } = require("../models/ServersideError");

//const readFileAsync = util.promisify(fs.readFile);

const PLAYERS = require("../data/players-data");

const onPlayerListRoute = async function(req, res) {
  // 3. Throw a custom general error
  // throw new ServersideError('Custom general error')

  const html = await loadHtml("player-list-mat.html");
  let rows = "";
  if (PLAYERS.length == 0) {
    rows = "<tr><td>NO DATA</td></tr>";
  } else {
    rows = PLAYERS.map(
      (mem, i) => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            <td><a href="/player-detail-mat?id=${i}">Chi Tiết</a></td>
            </tr>
        `
    ).reduce((prev, cur) => prev + cur, "");
  }

  const content = html.replace("{{row}}", rows);
  return content;
};

const onDefaultRoute = async function(req, res) {
  //async - await
  //   try {
  //     const html = await readFileAsync("views/default-mat.html", "utf8");
  //     return html;
  //   } catch (err) {
  //     throw err; // Thừa, có thể return trức tiếp.
  //   }
  return loadHtml("default-mat.html");
};

const onPlayerDetailRoute = async function(req) {
  const queryObj = parseQueryString(req.url);
  // console.log({
  //     queryObj })
  const id = parseInt(queryObj["id"]);
  if (Number.isNaN(id) || !PLAYERS[id]) {
    throw new ServersideError("Mã thành viên không tồn tại");
  }

  const member = PLAYERS[id];

  // Menu => Convert to async function
  const tpl = await loadHtml("player-detail-mat.html");

  let content = tpl
    .replace("{{index}}", id)
    .replace("{{hobby_list}}", buildHobbyList(member.hobbies))
    .replace("{{faculty_list}}", buildFacultyList(member.faculty));

  for (let prop in member) {
    // console.log(`@${prop}@`, member[prop])
    // content = content.replace(`@${prop}@`, member[prop]);
    let value;
    if (prop === "isGraduated") {
      value = member[prop] ? "checked" : "";
    } else {
      value = member[prop];
    }
    content = content.replace(new RegExp(`{{${prop}}}`, "g"), value);
  }

  return content;
};

const buildFacultyList = function(memFaculty) {
  let faStr = '<select name="faculty" class="form-control">';
  faStr += '<option value="">--Chọn chuyên ngành--</option>';

  // for (let hobby of Faculty) {
  for (let fac of Object.values(Faculty)) {
    const selected = memFaculty == fac.key ? "selected" : "";
    faStr += `<option value="${fac.key}" ${selected}>${fac.label}</option>`;
  }
  faStr += "</select>";
  return faStr;
};

const buildHobbyList = function(memHobbies) {
  let hobStr = "";
  // for (let hobby of Hobby) {
  for (let hobby of Object.values(Hobby)) {
    const selected = memHobbies.includes(hobby.key) ? "checked" : "";
    hobStr += `<input type="checkbox" value="${
      hobby.key
    }" name="hobbies" id="cb${hobby.key}" ${selected}>`;
    hobStr += `<label for="cb${hobby.key}" class="label-check">${
      hobby.label
    }</label><br>`;
  }
  return hobStr;
};

// member-handler-save.js
const onPlayerSaveRoute = async function(req) {
  const formData = await extractFormData(req);

  const member = PLAYERS[formData.id];
  if (member) {
    PLAYERS[formData.id] = {
      ...formData,
      age: parseInt(formData.age),
      isGraduated: !!formData.isGraduated
    };
    console.log({ updated: PLAYERS[formData.id] });
    return buildResponse("", 302, {
      Location: req.headers.referer || "/"
    });
  }
};

// Nếu mún gom lại 1 nơi xài: module.exports
module.exports = {
  //onDefaultRoute: onDefaultRoute
  // [ES6] Object property shortcut

  onDefaultRoute,
  onPlayerListRoute,
  onPlayerDetailRoute,
  onPlayerSaveRoute
};
