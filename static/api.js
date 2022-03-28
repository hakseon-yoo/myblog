/**
 * 
 */
function requestSignUpUser(userId, nickname, password, validpassword){
    $.ajax({
        type: "POST",
        url: "/api/user",
        data: {
            userId,
            nickname,
            password,
            validpassword,
        },
        success: function (response) {
            alert('회원가입을 축하드립니다.\n로그인 페이지로 이동합니다.');
            window.location.href = '/';
        },
        error: function (error) {
            alert(error.responseJSON.errorMessage);
        },
    });
}

function requestLogin(userId, password){
    $.ajax({
        type: "POST",
        url: "/api/auth",
        data: {
            userId,
            password,
        },
        success: function (response) {
            localStorage.setItem("token", response.token);
            window.location.href = '/board_list.html';
        },
        error: function (error) {
            alert(error.responseJSON.errorMessage);
        },
    });
}

function tokenCheck(callback){
    $.ajax({
        type: "GET",
        url: "/api/auth/check",
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function (response) {
            callback(response.user);
        },
        error: function (xhr, status, error) {
            if(xhr.status == 401){
                alert('로그인이 필요합니다.');
                window.location.href = '/';
            }else{
                localStorage.clear();
                alert('알 수 없는 에러가 발생했습니다. 관리자에게 문의하세요.');
            }
        },
    });
}




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