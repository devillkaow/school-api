'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enrollment extends Model {
    static get primaryKey() {
        return 'enrollment_id'
    }

    subject () {
        return this.belongsTo('App/Models/Subject')
    }
    student () {
        return this.belongsTo('App/Models/Student')
    }

}

module.exports = Enrollment