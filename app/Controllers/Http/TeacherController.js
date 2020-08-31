'use strict'

const Database= use('Database')
const Hash = use('Hash')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
    throw new Error(`param: ${number} is not supported, please use number typr param instead.`)
}

class TeacherController {

    async index(){
        const teachers = await Database.table('teachers')

        return { status: 200, error: undefined, data: teachers }
    }

    async show( { request } ){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error)
            return{ status: 500,error: validatedValue.error, data: undefined}

        const teacher = await Database
            .select('*')
            .from('teachers')
            .where("teacher_id", id)
            .first()

        return  { status: 200, error: undefined, data: teacher  || {} }
    }

    async store ({ request }){
        const { firstname, lastname, email, password } = request.body

        const missingKey = []

        if(!firstname) missingKey.push('firstname')
        if(!lastname) missingKey.push('lastname')
        if(!email) missingKey.push('email')
        if(!password) missingKey.push('password')

        if(missingKey.legth)
        return  { status: 422, error: `${missingKey} is missing.`, data:undefined }

        const hashedPassword = await Hash.make(password)

        const teacher = await Database
            .table('teachers')
            .insert({ firstname, lastname, email, password: hashedPassword })
        
        return  { status: 200, error: undefined, data: { firstname, lastname, email } }
    }
}

module.exports = TeacherController
