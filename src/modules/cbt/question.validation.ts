import Joi from 'joi';

const schema = Joi.object({
    question: Joi.string().required(),
    option1: Joi.string().required(),
    option2: Joi.string().required(),
    option3: Joi.string().empty(),
    option4: Joi.string().empty(),
    answer: Joi.string().required(),
    isTrueOrFalse: Joi.bool()
});

export default schema;