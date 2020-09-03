'use strict'

const Database= use('Database')
const Hash = use('Hash')
const Student = use('App/Models/Stident')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
    throw new Error(`param: ${number} is not supported, please use number typr param instead.`)
}

class StudentController {

    async index(){
        const { references } = request.qs
        const students = Student.query()

        if (references) {
            const extractedReferences = references.split(",")
            students.with(extractedReferences)
        }

        return { status: 200, error: undefined, data: await students.fetch() }
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

        const rules = {
            firstname:'required',
            lastname:'required',
            email:'required|email|unique:students,email',
            password:'required|min:8'
        }

        const validation = await Validator.validateAll(request.body, rules)

        if(validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const hashedPassword = await Hash.make(password)

        const student = await Database
            .table('students')
            .insert({ firstname, lastname, email, password: hashedPassword, group_id})
        
        return  { status: 200, error: undefined, data: { firstname, lastname, email, group_id } }
    }

    async update ({ request }) {
        const { body, params } = request 
        const { id } = params
        const { firstname, lastname, email, group_id } = body

        const studentId = await Database
            .table('students')
            .where({ student_id: id })
            .update({ firstname, lastname, email, group_id })

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
