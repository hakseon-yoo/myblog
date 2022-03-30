const express = require('express');
// const Joi = require('joi');
const router = express.Router();
const Comment = require('../schemas/comment');
const sanitizehtml = require('sanitize-html');

router.post('/comment', async (req, res) => {
    const {boardId, userId, comment} = req.body;

    const sanitizeboardId = sanitizehtml(boardId);
    const sanitizeuserId = sanitizehtml(userId);
    const sanitizecomment = sanitizehtml(comment);

    if(!sanitizeboardId.length) return res.status(400).send({errorMessage: '유효하지 않은 boardId 입니다.'});
    if(!sanitizeuserId.length) return res.status(400).send({errorMessage: '유효하지 않은 userId 입니다.'});
    if(!sanitizecomment.length) return res.status(400).send({errorMessage: '댓글이 입력되지 않았거나, 올바르지 않습니다.'});

    let commentId = 1;
    const maxOrderComment = await Comment.findOne().sort('-commentId');
    if(maxOrderComment) commentId = maxOrderComment.commentId + 1;

    const regdt = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');

    await Comment.create({
        commentId: commentId,
        boardId: sanitizeboardId,
        userId: sanitizeuserId,
        comment: sanitizecomment,
        regdt: regdt,
    });

    res.send({});
});

router.put('/comment', async (req, res) => {
    const {boardId, commentId, comment} = req.body;

    const sanitizeboardId = sanitizehtml(boardId);
    const sanitizecommentId = sanitizehtml(commentId);
    const sanitizecomment = sanitizehtml(comment);

    if(!sanitizeboardId.length) return res.status(400).send({errorMessage: '유효하지 않은 boardId 입니다.'});
    if(!sanitizecommentId.length) return res.status(400).send({errorMessage: '유효하지 않은 commentId 입니다.'});
    if(!sanitizecomment.length) return res.status(400).send({errorMessage: '댓글이 입력되지 않았거나, 올바르지 않습니다.'});

    const validComment = await Comment.findOne({ boardId, commentId });
    // console.log([validComment].length);
    if(![validComment].length){
        res.status(400).send({
            errorMessage: '수정할 댓글이 존재하지 않습니다.'
        });
    }

    await Comment.updateOne({boardId: sanitizeboardId, commentId: sanitizecommentId}, {$set: {comment: sanitizecomment} });
    res.send('댓글수정성공');
});

router.delete('/comment', async (req,res) => {
    const {boardId, commentId} = req.body;

    const validComment = await Comment.findOne({ boardId, commentId });
    // console.log([validComment].length);
    if(![validComment].length){
        res.status(400).send({
            errorMessage: '삭제할 댓글이 존재하지 않습니다.'
        });
    }

    await Comment.deleteOne({boardId: boardId, commentId: commentId});
    res.send('댓글삭제성공');
});

router.get('/comment/:boardId', async (req, res) => {
    const {boardId} = req.params;
    const Commentlist = await Comment.find({ boardId }).sort('-commentId');

    res.send({Commentlist});
});


module.exports = router;