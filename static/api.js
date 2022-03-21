function requestBoardList(callback) {
    $.ajax({
        type: "GET",
        url: "/api/boardlist",
        success: function (response) {
            callback(response['boardlist']);
        },
    });
}

function requestBoardWrite(title, regid, password, content, callback){
    /**
     * 파라미터 정보
     *  - title : 게시글 제목(필수 값)
     *  - regid : 작성자(필수 값)
     *  - password : 해당 게시글의 패스워드(필수 값)
     *  - content : 글 내용(필수 값)
     */
    
    $.ajax({
        type: "POST",
        url: "/api/board",
        data: {
            title,
            regid,
            password,
            content,
        },
        success: function (response) {
            callback(response);
        },
    });
}

function requestBoardDetail(boardId, callback){
    $.ajax({
        type: "GET",
        url: "/api/boarddetail",
        data: {
            boardId: boardId,
        },
        success: function (response) {
            callback(response['boarddetail'][0]);
        },
    });
}

function requestBoardUpdate(title, regid, password, content, boardId, callback){
    $.ajax({
        type: "PUT",
        url: "/api/board",
        data: {
            title: title,
            regid: regid,
            password: password,
            content: content,
            boardId: boardId,
        },
        error: function (xhr, status, error){
            if(xhr.status == 400){
                alert('패스워드가 일치하지 않습니다.');
            }
        },
        success: function (response) {
            callback(response);
        },
    });
}

function requestBoardDelete(boardId, password, callback){
    alert(boardId);
    $.ajax({
        type: "DELETE",
        url: "/api/board",
        data: {
            boardId: boardId,
            password: password,
        },
        error: function (xhr, status, error){
            if(xhr.status == 400){
                alert('패스워드가 일치하지 않습니다.');
            }
        },
        success: function (response) {
            callback(response);
        },
    });
}