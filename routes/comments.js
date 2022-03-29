const express = require('express');
// const Joi = require('joi');
const router = express.Router();
const Comment = require('../schemas/comment');
const sanitizehtml = require('sanitize-html');

router.post('/comment', async (req, res) => {
    const {boardId, userId, comment} = req.body;

    let commentId = 1;
    const maxOrderComment = await Comment.findOne().sort('-commentId');
    if(maxOrderComment) commentId = maxOrderComment.commentId + 1;

    const regdt = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');

    await Comment.create({
        commentId: commentId,
        boardId: boardId,
        userId: userId,
        comment: comment,
        regdt: regdt,
    });

    res.send({});
});

router.put('/comment', async (req, res) => {
    const {boardId, commentId, comment} = req.body;

    const validComment = await Comment.findOne({ boardId, commentId });
    // console.log([validComment].length);
    if(![validComment].length){
        res.status(400).send({
            errorMessage: '수정할 댓글이 존재하지 않습니다.'
        });
    }

    await Comment.updateOne({boardId: boardId, commentId: commentId}, {$set: {comment: comment} });
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