const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');
    
    // 토큰 타입을 검사한다.
    if(tokenType !== 'Bearer'){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        })
        return;
    }

    try {
        const {userId} = jwt.verify(tokenValue, 'MYBLOG'); // userId가 없으면 오류가 나기 때문에 catch로 넘어가게 된다.
        User.findOne({userId}).then((user) => { // 위 코드에서 오류가 나게 되면 아래 코드는 안타기 때문에, 아래에서 userId를 DB에서 조회할 때 무조건 있다는 가정하에 코드를 작성한다.
            res.locals.user = user;
            next();
        })
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요.'
        });
        return;
    }
}