import Joi from "joi";

export const authValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})