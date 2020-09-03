const Validator = use("Validator")

module.exports = async function teacherValidator ({firstname, lastname, email, password}){
    const rules = {
        firstname: 'required',
        lastname: 'required',
        email: 'required|email|unique:teachers,email',
        password:'required|min:8'
    }
    const validation = await Validator.validateAll({
        firstname, lastname, email, password
    }, rules)

    return{

    }
}