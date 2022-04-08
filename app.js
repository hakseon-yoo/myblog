const express = require('express');
const connect = require('./schemas');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output');

connect();

const boardsRouter = require('./routes/boards');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comments');

const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(cors());
app.use(express.static('static')); // html 파일과 연결시켜주는 미들웨어 인 것 같다. 자동으로 index.html을 연결시켜주는 것 같다.
app.use(express.json());
app.use(express.urlencoded({ extended: true})); // 클라이언트에서 Ajax로 요청할 때, 얘 없으면 body를 안받아버린다;
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(requestMiddleware);

app.use('/api', [
    boardsRouter,   // 게시판
    usersRouter,    // 회원가입
    authRouter,     // 로그인 및 토큰검사
    commentRouter   // 게시판 댓글
]);

// app.get('/good', async (req, res) => {
//     const [board_list] = await Board.find({});
//     console.log(board_list);
//     res.json({board_list});
// })

app.listen(port, () => {
    console.log(port, '포트로 서버 on');
})