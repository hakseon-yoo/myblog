const express = require('express');
const router = express.Router();

const Board = require('../schemas/board');

/**
 * api name : 게시글 목록 조회
 * api function : 입력된 게시글을 전체조회한다. 단, 작성일자를 내림차순으로 조회한다.
 * type : GET
 * url : api/boardlist
 * request : None
 * response : {boardlist} set
 */
router.get('/boardlist', async (req, res) => {
    const boardlist = await Board.find().sort({regdt: -1});

    res.json({boardlist: boardlist});
});

/**
 * api name : 게시글 상세 조회
 * api function : 게시글에 대한 상세정보를 조회한다.
 * type : GET
 * url : api/boarddetail/:boardId
 * request : boardId
 * response : {boarddetail} set
 */
router.get('/boarddetail', async (req, res) => {
    const {boardId} = req.query;
    const boarddetail = await Board.find({_id: boardId}) //문자나 숫자들어오면 죽는데; 이거 좀 고쳐봐야겠다; 일단 되니까 둔다.
    res.json({boarddetail: boarddetail});
});

/**
 * api name : 게시글 작성
 * api function : 게시글을 작성한다. 작성 시 반드시 모든 입력 값이 있어야한다.
 * type : POST
 * url : api/board
 * request : title, regid, password, content
 * response : json({success, msg})
 */
 router.post('/board', async (req, res) => {
    const {title, regid, password, content} = req.body;
    const regdt = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');

    //입력된 값을 받아, DB에 도큐먼트 삽입
    await Board.create({
        title,
        regid,
        password,
        content,
        regdt: regdt,
    });

    res.json({success: true, msg: 'server message : 게시글 작성 성공.'});
});

/**
 * api name : 게시글 수정
 * api function
 *  - 입력된 게시글을 수정한다.
 *  - 단, 게시글 수정 시 입력했던 기존 패스워드와 동일해야만 글을 수정할 수 있도록 한다.
 * type : PUT
 * url : api/board
 * request : boardid, title, password, regid, content
 * response : json({success, msg})
 */
 router.put('/board', async (req, res) => {
    const {title, regid, password, content, boardId} = req.body;
    const [boarddetail] = await Board.find({_id: boardId})

    if(boarddetail['password'] !== password){
        return res.json({ code: false, msg: 'server message : 패스워드가 일치하지 않음' });
        // return res.status(400).json({ code: false, msg: 'server message : 패스워드가 일치하지 않음' });
    }
    
    if(![boarddetail].length){
        return res.json({ success: false, msg: 'server message : 수정할 게시물이 존재하지 않음' });
        // return res.status(400).json({ success: false, msg: 'server message : 수정할 게시물이 존재하지 않음' });
    }   
    
    await Board.updateOne({ _id: boardId }, { $set: { title: title, regid: regid, content:content } });
    res.json({ success: true, msg: 'server message : 게시글이 수정 성공.' })
});

/**
 * api name : 게시글 삭제
 * api function
 *  - 입력된 게시글을 삭제한다.
 *  - 단, 게시글 수정 시 입력했던 기존 패스워드와 동일해야만 글을 삭제할 수 있도록 한다.
 * type : DELETE
 * url : api/board
 * request : boardid, password
 * response : json({success, msg})
 */
 router.delete('/board', async (req, res) => {
    const {boardId, password} = req.body;
    const [boarddetail] = await Board.find({_id: boardId})

    if(boarddetail['password'] !== password){
        return res.json({ code: false, msg: 'server message: 패스워드가 일치하지 않음' });
        // return res.status(400).json({ code: false, msg: 'server message : 패스워드가 일치하지 않음' });
    }
    
    if(![boarddetail].length){
        return res.json({ success: false, msg: 'server message: 삭제할 게시물이 존재하지 않음' });
        // return res.status(400).json({ success: false, msg: 'server message : 수정할 게시물이 존재하지 않음' });
    }
    
    await Board.deleteOne({_id: boardId});
    res.json({ success: true, msg: 'server message: 게시글 삭제 성공.' });
});

module.exports = router