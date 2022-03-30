const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../schemas/user');
const authMiddleware = require('../middlewares/auth-middleware');

const sanitizehtml = require('sanitize-html');


/**
 * api name : 로그인
 * api function
 *  - 클라이언트에서 입력받은 로그인 정보 DB 내 조회
 *  - DB 내 조회되는 정보가 있다면, 로그인 조건 성립
 *  - 로그인 조건 성립 시 JWT 토큰 발급 후 성공처리
 * type : POST
 * url : api/auth
 * request : userId, password
 * response : -
 */
router.post('/auth', async (req, res) => {
    const {userId, password} = req.body;

    // 1. 클라이언트에서 요청받은 정보로 DB에서 조회한다. 결과 값이 존재하는 경우 로그인 성공으로 간주한다.
    const user = await User.findOne({
        $and: [
            {userId, password}
        ]
    })
    if(user === null){ // DB 내 정보가 null인 경우, 사용자가 없으므로 400 error로 return 시킨다.
        res.status(400).send({
            errorMessage: '존재하지 않는 사용자 정보입니다.',
        });
        return;
    }
    //토큰발급 후 클라이언트에 토근과 함께 성공처리를 내려준다.
    const token = jwt.sign({ userId: user.userId }, "MYBLOG");
    res.send({ token, userId });
});

/**
 * api name : 토큰검사
 * api function : 로그인 시, 클라이언트에 발급한 토큰정보가 유효한지 검사한다.
 * type : GET
 * url : api/auth/check
 * request : -
 * response : user
 */
router.get('/auth/check', authMiddleware, (req, res) => {
    const {user} = res.locals;
    res.send({user});
});

module.exports = router;