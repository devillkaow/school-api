'use strict'

const { test } = use('Test/Suite')('Teacher Validator')
const teachserValidator = require('../../Service/TeacherValidator')
test('should return error when pass incorrct email', async ({ assert })=> {
  const validatoredData = await teachserValidator("Jonh", "Doe", "john@mail.com", "12344")
  assert.isArray(validatoredData.error)
})

test('should return more than one error if multiple incorrect data is passed', async  ({ assert })=> {
  const validatoredData = await teachserValidator("Jonh", "Doe", "john@mail.com", "12344")
  assert.isAbove(validatoredData.error.length, 1)
})

// test('should return undefined when pass correct data', async  ({ assert })=> {
//   const validatoredData = await teachserValidator({
//   firstname: "John",
//   lastname: "Doe",
//   email: "john@mail.com",
//   password: "123455678"
//   })
//   assert
// })

