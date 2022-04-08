/**
 * function 명 : requestSelectComment() => 댓글조회 기능
 * function 내용 : 해당 게시물에 작성된 댓글을 조회한다.
 * parameter : boardId
 * return : callback
 */
function requestSelectComment(boardId, callback){
    $.ajax({
        type: "GET",
        url: `/api/comment/${boardId}`,
        // data: {
        //     boardId: boardId
        // },
        success: function (response) {
            callback(response['Commentlist']);
        }
    });
}

/**
 * function 명 : requestSaveComment() => 댓글작성 기능
 * function 내용 : 
 * parameter : boardId, comment
 * return : callback
 */
function requestSaveComment(boardId, comment){

    // 임시방편으로 클라이언트에서 validcheck 한다. 나중에 서버에서 joi로 검증하도록 바꾼다.
    if(!comment.length){
        alert('댓글을 입력해주세요.');
        $('#taComment').focus();
        return;
    }

    tokenCheck((u) => {
        $.ajax({
            type: "POST",
            url: "/api/comment",
            data: {
                boardId: boardId,
                userId: u.userId,
                comment: comment
            },
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                alert(error.responseJSON.errorMessage);
            },
        });
    })
}

/**
 * function 명 : requestSaveComment() => 댓글수정 기능
 * function 내용 : 사용자가 기존에 입력했던 댓글을 수정하는 기능
 * parameter : boardId, commentId
 * return : callback
 */
function requestUpdateComment(boardId, commentId){

    const comment = $('#ipUpdateComment_'+commentId).val();

    // 임시방편으로 클라이언트에서 validcheck 한다. 나중에 서버에서 joi로 검증하도록 바꾼다.
    if(!comment.length){
        alert('댓글을 입력해주세요.');
        return;
    }

    tokenCheck((u) => {
        $.ajax({
            type: "PUT",
            url: "/api/comment",
            data: {
                boardId: boardId,
                commentId: commentId,
                comment: comment
            },
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                alert(error.responseJSON.errorMessage);
            },
        });
    })
}

/**
 * function 명 : requestDeleteComment() => 댓글삭제 기능
 * function 내용 : 사용자가 기존에 입력했던 댓글을 삭제하는 기능
 * parameter : boardId, commentId
 * return : callback
 */
function requestDeleteComment(boardId, commentId){
    tokenCheck((u) => {
        $.ajax({
            type: "DELETE",
            url: "/api/comment",
            data: {
                boardId: boardId,
                commentId: commentId
            },
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                alert(error.responseJSON.errorMessage);
            },
        });
    })
}


/**
 * function 명 : LogOut() => 로그아웃 기능
 * function 내용 : 사용자 localStorage 내 토큰을 제거하고, 메인페이지로 전환시킨다.
 * parameter : -
 * return : -
 */
function LogOut() {
    localStorage.clear();
    window.location.href = "/";
}

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
            window.location.href = '/login.html';
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
            localStorage.setItem("userId", response.userId);
            window.location.href = '/';
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
                window.location.href = '/login.html';
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
    alert(1);
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