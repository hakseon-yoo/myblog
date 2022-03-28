const express = require('express');
const router = express.Router();

const User = require('../schemas/user');

const sanitizehtml = require('sanitize-html');

/**
 * api name : 회원가입
 * api function
 *  - 회원가입 창에서 입력된 정보를 토대로 유저정보를 생성한다.
 *  - userId 또는 nickname 중복검사 후 기존재하는 ID가 있다면 실패처리한다.
 *  - password와 validpassword가 동일하지 않은 경우 실패처리한다.
 *  - 위 조건을 만족하는 경우 회원가입을 진행한다.
 * type : POST
 * url : api/user
 * request : userId, nickname, password, validpassword
 * response : -
 */
router.post('/user', async (req, res) => {
    const {userId, nickname, password, validpassword} = req.body;
    // console.log(userId, nickname, password, validpassword);

    // 1. 클라이언트에서 받아온 필수정보 null check

    // 2. userId, nickname 기존재여부 체크
    const user = await User.find({
        $or: [
            {userId: userId},
            {nickname: nickname}
        ]
    });
    console.log(user.length);
    if(user.length){
        res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return;
    }

    // 3. password와 validpassword 동일여부 체크
    if(password !== validpassword){
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        });
        return;
    }
    // 4. 위 1,2,3번 통과 시 회원정보 DB 내 INSERT 후 성공처리
    await User.create({
        userId, nickname, password
    });
    res.status(201).send('');
});

module.exports = router;