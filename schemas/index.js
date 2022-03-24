const mongoose = require('mongoose');

const connect = () => {
    const mongooseId = process.env.MONGO_ID
    const mongoosePw = process.env.MONGO_PWD
    mongoose
        //몽고디비의 기본포트 27017
        // .connect('mongodb://localhost:27017/mb_board', { ignoreUndefined: true })
        .connect('mongodb://'+mongooseId+':'+mongoosePw+'@localhost:27017/mb_board?authSource=admin&authMechanism=SCRAM-SHA-1', { ignoreUndefined: true })
        .catch((err) => {
            console.error(err)
        });
};

module.exports = connect;