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

        const missingKey = []

        if(!mark) missingKey.push('mark')
        // if(!mark_date) missingKey.push('mark_date')
        if(!student_id) missingKey.push('student_id')
        if(!subject_id) missingKey.push('subject_id')


        if(missingKey.legth)
        return  { status: 422, error: `${missingKey} is missing.`, data:undefined }

        const enrollment = await Database
            .table('enrollments')
            .insert({ mark, mark_date, student_id, subject_id })
        
        return  { status: 200, error: undefined, data: { mark, mark_date, student_id, subject_id } }
    }
}

module.exports = EnrollmentController
