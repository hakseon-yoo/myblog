const express = require('express');
const connect = require('./schemas');
require('dotenv').config();
const app = express();
const port = 3000;

connect();

const boardsRouter = require('./routes/boards');

const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

/**
 * html 파일과 연결시켜주는 코드인 것 같다.
 * 자동으로 index.html을 연결시켜주는 것 같다.
 */
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true})); // 클라이언트에서 Ajax로 요청할 때, 얘 없으면 body를 안받아버린다;
app.use(requestMiddleware);

app.use('/api', [boardsRouter]);

// app.get('/good', async (req, res) => {
//     const [board_list] = await Board.find({});
//     console.log(board_list);
//     res.json({board_list});
// })

app.listen(port, () => {
    console.log(port, '포트로 서버 on');
})