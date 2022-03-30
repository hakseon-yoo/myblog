const Joi = require('joi');

module.exports = async (req, res, next) => {

    const validcheck = Joi.object({
        userId: Joi.string().min(3).alphanum().required().error(new Error('ID는 3자 이상, 영문 또는 숫자로 입력되어야 합니다.')),
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