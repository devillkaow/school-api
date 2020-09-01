'use strict'

const Database= use('Database')
const Hash = use('Hash')
const Validator = use('Validator')

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

        const rules = {
            firstname:'required',
            lastname:'required',
            email:'required|email|unique:teachers,email',
            password:'required|min:8'
        }

        const validation = await Validator.validateAll(request.body, rules)

        if(validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const hashedPassword = await Hash.make(password)

        await Database
            .table('teachers')
            .insert({ firstname, lastname, email, password: hashedPassword })
        
        return  { status: 200, error: undefined, data: { firstname, lastname, email } }
    }

    async update ({ request }) {
        const { body, params } = request 
        const { id } = params
        const { firstname, lastname, email } = body

        const teacherId = await Database
            .table('teachers')
            .where({ teacher_id: id })
            .update({ firstname, lastname, email })

        const teacher = await Database
            .table('teachers')
            .where({ teacher_id: teacherId })
            .first()
        
        return { status: 200, error: undefined, data: teacher }
    }

    async destroy({ request }){
        const { id } = request.params

        await Database
            .table('teachers')
            .where({ teacher_id: id })
            .delete()

        return { status: 200, error: undefined, data: { message: 'success' }}
    }
}

module.exports = TeacherController
