'use strict'

const StudentController = require('../app/Controllers/Http/StudentController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(()=>{
  
  Route.resource('/teachers', 'TeacherController')
  Route.resource('/students', 'StudentController')
  Route.resource('/groups', 'GroupController')

  Route.resource('/subjects', 'SubjectController')
  Route.get('/subject/:id/teacher', 'SubjectController.showTeacher')

  Route.resource('/enrollments', 'EnrollmentController')

}).prefix('api/v1')

