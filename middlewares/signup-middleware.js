const Joi = require('joi');

module.exports = async (req, res, next) => {

    const validcheck = Joi.object({
        userId: Joi.string().min(3).alphanum().required(),
        nickname: Joi.string().required(),
        password: Joi.string().min(4).required(),
        validpassword: Joi.string().min(4).required(),
    });

    try {
        await validcheck.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).send({
            errorMessage: error.message
        });
    }
    
}