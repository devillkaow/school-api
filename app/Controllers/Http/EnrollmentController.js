'use strict'

const Database= use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
    throw new Error(`param: ${number} is not supported, please use number typr param instead.`)
}

class EnrollmentController {

    async index(){
        const enrollments = await Database.table('enrollments')

        return { status: 200, error: undefined, data: enrollments }
    }

    async show( { request } ){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error)
            return{ status: 500,error: validatedValue.error, data: undefined}

        const enrollment = await Database
            .select('*')
            .from('enrollments')
            .where("enrollment_id", id)
            .first()

        return  { status: 200, error: undefined, data: enrollment  || {} }
    }

    async store ({ request }){
        const { mark, mark_date, student_id, subject_id  } = request.body

        const rules = {
            mark:'required',
            mark_date:'required',
            student_id:'required',
            subject_id:'required'            
        }

        const validation = await Validator.validateAll(request.body, rules)

        if(validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const enrollment = await Database
            .table('enrollments')
            .insert({ mark, mark_date, student_id, subject_id })
        
        return  { status: 200, error: undefined, data: { mark, mark_date, student_id, subject_id } }
    }

    async update ({ request }) {
        const { body, params } = request 
        const { id } = params
        const { mark, mark_date, student_id, subject_id } = body

        const enrollmentId = await Database
            .table('enrollments')
            .where({ enrollment_id: id })
            .update({ mark, mark_date, student_id, subject_id })

        const enrollment = await Database
            .table('enrollments')
            .where({ enrollment_id: enrollmentId })
            .first()
        
        return { status: 200, error: undefined, data: enrollment }
    }

    async destroy({ request }){
        const { id } = request.params

        await Database
            .table('enrollments')
            .where({ enrollment_id: id })
            .delete()

        return { status: 200, error: undefined, data: { message: 'success' }}
    }

}

module.exports = EnrollmentController
