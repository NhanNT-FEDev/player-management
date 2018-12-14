const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')

function validateName(name, errors) {
    if (!name) {
        return errors.push('Yêu cầu nhập Họ tên')
    }
    return name
}

function validateAge(age, errors) {
    age = parseInt(age)
    if (!Number.isSafeInteger(age) || age <= 0 || age > 100) {
        return errors.push('Tuổi không hợp lệ')
    }
    return age
}

function validateGraduated(isGraduated, errors) {
    return !!isGraduated // Boolean(isGraduated)
}

function validateFaculty(faculty, errors) {
    if (faculty != null && faculty != '') {
        const isValidEnum = Object.values(Faculty).some(f => f.key === faculty)
        if (!isValidEnum) {
            return errors.push('Chuyên ngành không hợp lệ')
        }
    }
    return faculty
}

function validateHobbies(hobbies, errors) {
    if (!hobbies) {
        return []
    }
    else if (!Array.isArray(hobbies)) {
        hobbies = [hobbies]
    }
    else if (hobbies.length == 0) {
        return hobbies // Hobbies are optional
    }

    const isValidEnum = hobbies.every(hobby => {
        return Object.values(Hobby).some(h => h.key === hobby)
    })
    if (!isValidEnum) {
        return errors.push('Sở thích không hợp lệ')
    }

    return hobbies
}

class Member {
    static from(obj) {
        if (!obj) { return null }
        let { name, age, address, isGraduated, faculty, hobbies } = obj
        const errors = []

        name = validateName(name, errors)
        age = validateAge(age, errors)
        isGraduated = validateGraduated(isGraduated, errors)
        faculty = validateFaculty(faculty, errors)
        hobbies = validateHobbies(hobbies, errors)

        if (errors.length) {
            return {
                errors,
                data: null
            }
        }

        // No need else
        const mem = new Member
        mem.name = name
        mem.age = age
        mem.address = address
        mem.isGraduated = isGraduated
        mem.faculty = faculty
        mem.hobbies = hobbies

        return {
            errors: null,
            data: mem
        }
    }

    constructor() {
        this.name = ''
        this.age = ''
        this.address = ''
        this.isGraduated = false
        this.faculty = ''
        this.hobbies = []
    }
}

exports.Member = Member