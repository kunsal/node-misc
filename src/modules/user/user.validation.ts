import Joi from "joi";

const createUserValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    roleId: Joi.number()
})

export default createUserValidation;