'use strict'

const Database= use('Database')
const Hash = use('Hash')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
    throw new Error(`param: ${number} is not supported, please use number typr param instead.`)
}

class StudentController {

    async index(){
        const students = await Database.table('students')

        return { status: 200, error: undefined, data: students }
    }

    async show( { request } ){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error)
            return{ status: 500,error: validatedValue.error, data: undefined}

        const student = await Database
            .select('*')
            .from('students')
            .where("student_id", id)
            .first()

        return  { status: 200, error: undefined, data: student  || {} }
    }

    async store ({ request }){
        const { firstname, lastname, email, password, group_id } = request.body

        const missingKey = []

        if(!firstname) missingKey.push('firstname')
        if(!lastname) missingKey.push('lastname')
        if(!email) missingKey.push('email')
        if(!password) missingKey.push('password')
        if(!group_id) missingKey.push('group_id')

        if(missingKey.legth)
        return  { status: 422, error: `${missingKey} is missing.`, data:undefined }

        const hashedPassword = await Hash.make(password)

        const student = await Database
            .table('students')
            .insert({ firstname, lastname, email, password: hashedPassword, group_id})
        
        return  { status: 200, error: undefined, data: { firstname, lastname, email, group_id } }
    }

    async update ({ request }) {
        const { body, params } = request 
        const { id } = params
        const { firstname, lastname, password, email, group_id } = body

        const studentId = await Database
            .table('students')
            .where({ student_id: id })
            .update({ firstname, lastname, password, email, group_id })

        const student = await Database
            .table('students')
            .where({ student_id: studentId })
            .first()
        
        return { status: 200, error: undefined, data: student }
    }

    async destroy({ request }){
        const { id } = request.params

        await Database
            .table('students')
            .where({ student_id: id })
            .delete()

        return { status: 200, error: undefined, data: { message: 'success' }}
    }
}

module.exports = StudentController
