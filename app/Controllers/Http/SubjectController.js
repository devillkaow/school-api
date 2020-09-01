'use strict'

const Database= use('Database')

function numberTypeParamValidator(number) {
    if(Number.isNaN(parseInt(number))) 
    throw new Error(`param: ${number} is not supported, please use number typr param instead.`)
}

class SubjectController {

    async index(){
        const subjects = await Database.table('subjects')

        return { status: 200, error: undefined, data: subjects }
    }

    async show( { request } ){
        const { id } = request.params

        const validatedValue = numberTypeParamValidator(id)

        if(validatedValue.error)
            return{ status: 500,error: validatedValue.error, data: undefined}

        const subject = await Database
            .select('*')
            .from('subjects')
            .where("subject_id", id)
            .first()

        return  { status: 200, error: undefined, data:subject  || {} }
    }

    async store ({ request }){
        const { title, teacher_id } = request.body

        const rules = {
            title:'required|unique:subjects,title',
            teacher_id:'required'            
        }

        const validation = await Validator.validateAll(request.body, rules)

        if(validation.fails())
            return { status: 422, error: validation.messages(), data: undefined }

        const subject = await Database
            .table('subjects')
            .insert({ title, teacher_id })
        
        return  { status: 200, error: undefined, data: { title, teacher_id } }
    }

    async update ({ request }) {
        const { body, params } = request 
        const { id } = params
        const { title, teacher_id } = body

        const subjectId = await Database
            .table('subjects')
            .where({ subject_id: id })
            .update({ title, teacher_id })

        const subject = await Database
            .table('subjects')
            .where({ subject_id: subjectId })
            .first()
        
        return { status: 200, error: undefined, data: subject }
    }

    async destroy({ request }){
        const { id } = request.params

        await Database
            .table('subjects')
            .where({ subject_id: id })
            .delete()

        return { status: 200, error: undefined, data: { message: 'success' }}
    }
}

module.exports = SubjectController
