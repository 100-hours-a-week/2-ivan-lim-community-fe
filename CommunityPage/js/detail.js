// URL에서 ?id=123과 같이 쿼리 문자열로 ID가 포함된 경우
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
console.log(postId);

fetch(`http://localhost:5001/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
        console.log(post);
    return fetch(`http://localhost:5001/users/${post.writerId}`)
        .then(response => response.json())
        .then(user => {
            console.log(user);
        updatePostContent(post, user);
        });
    })

function updatePostContent(post,user) {
    const $title= document.querySelector('.mainWrap--header h2');
    $title.textContent = post.title;

    const $profileImage = document.querySelector('.mainWrap--header img');
    $profileImage.src = user.profileImage;

    const $writerName = document.getElementById('writer');
    $writerName.textContent = user.name;

    const $postDate = document.getElementById('time');
    $postDate.textContent = post.date;

    const $postImage = document.querySelector('.mainWrap > img');
    $postImage.src = post.image;

    const $postContent = document.querySelector('.mainWrap--content > p');
    $postContent.textContent = post.content;

    const $likeCount = document.getElementById('like');
    const $viewCount = document.getElementById('view');
    const $commentCount = document.getElementById('comment');
    $likeCount.textContent = post.like;
    $viewCount.textContent = post.view;
    $commentCount.textContent = post.comments.length;

    fetch(`http://localhost:5001/comments?postId=${postId}`)
        .then(response => response.json())
        .then(comments => {
            console.log(comments);
            renderComments(comments);
        });

}

function renderComments(comments) {
    const $mainWrap = document.querySelector('.mainWrap');
    let $historyBox;
    let $editBtn;
    let $deleteBtn;

    comments = comments.slice().reverse();
    comments.forEach(comment => {
        fetch(`http://localhost:5001/users/${comment.writerId}`)
            .then(response => response.json())
            .then(user => {
                $historyBox = document.createElement('div');
                $historyBox.classList.add('mainWrap--historyBox');
                $historyBox.innerHTML = `<div class="mainWrap--historyBox">
                    <div class="mainWrap--historyBox--leftBox">
                        <div class="mainWrap--historyBox--leftBox--top">
                            <span>
                                <img src="${user.profileImage}" alt="춘식" />
                            </span>
                            <span id="writer">${user.name}</span>
                            <span id="time">${comment.date}</span>
                        </div>
                        <div class="mainWrap--historyBox--leftBox--bottom" id="content-${comment.id}">
                            <p>
                                ${comment.content}
                            </p>
                        </div>
                    </div>
                    <div class="mainWrap--historyBox--rightBox">
                        <button class="optionBtn edit-${comment.id}">수정</button>
                        <button class="optionBtn delete-${comment.id}">삭제</buton>
                    </div>
                </div>`;
                $mainWrap.appendChild($historyBox);
                $editBtn = $historyBox.querySelector(`.edit-${comment.id}`);
                $deleteBtn = $historyBox.querySelector(`.delete-${comment.id}`);

                 // id 전달해야 함.
                $editBtn.addEventListener('click', () => clickCommentEditBtn(comment.id));
                $deleteBtn.addEventListener('click', () => clickCommentDeleteBtn(comment.id));

                function clickCommentEditBtn(commentId) {
                    const $commentContent = document.querySelector(`#content-${commentId} > p`);
                    const $commentEditBox = document.createElement('textarea');
                    
                    $commentEditBox.value = $commentContent.textContent;
                    $commentEditBox.classList.add('comment-edit'); // 원하는 클래스 추가
                    
                    $commentContent.style.display = 'none';
                    $commentContent.parentNode.appendChild($commentEditBox);
                    
                    // 저장 버튼 생성
                    const $saveButton = document.createElement('button');
                    $saveButton.textContent = '저장';
                    $commentContent.parentNode.appendChild($saveButton);

                    $saveButton.addEventListener('click', () => {
                    $commentContent.textContent = $commentEditBox.value;
                    $commentContent.style.display = 'block';
                    
                    $commentEditBox.remove();
                    $saveButton.remove();
                
                    // 서버에 변경 내용 저장 등 추가 작업 가능
                    console.log(`Comment ${commentId} updated to:`, $commentContent.textContent);
                    });
                }

                function clickCommentDeleteBtn(commentId){
                    $modal.style.display = 'flex';
                    modalType = CommentModal;
                    selectedCommentId = commentId;
                }
                
            });
        }

    )        
}


const $previousBtn = document.querySelector('header > button');

const $postEditBtn = document.getElementById("postEditBtn");
const $postDeleteBtn = document.getElementById("postDeleteBtn");

let modalType;
let selectedCommentId;
const PostModal = 1;
const CommentModal = 2;
const $modal = document.querySelector('.modal');
const $modalCancelBtns = document.querySelectorAll('.modalContent--cancelBtn');
const $modalCheckBtns = document.getElementsByClassName('modalContent--checkBtn');

const $commentInput = document.querySelector('.mainWrap--commentBox > textarea');
const $commentSubmitBtn = document.querySelector('.mainWrap--commentBox--btnBox > button');


function clickPreviousBtn() {
    window.location.href = "/listInquiry";
}

function clickPostEditBtn() {
    window.location.href = "/postEdit?id=" + postId;
}

function clickPostDeleteBtn() {
    modalType = PostModal;
    $modal.style.display = 'flex';
}

function clickCancelBtn() {
    $modal.style.display = 'none';
}

function clickCheckBtn() {
    if(modalType === PostModal) {
        fetch(`http://localhost:5001/posts/${postId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/listInquiry";
                }
            });
        }
    else if(modalType === CommentModal) {
        fetch(`http://localhost:5001/comments/${selectedCommentId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete comment');
                        }
                        return fetch(`http://localhost:5001/posts/${postId}`);
                    })
                    .then(response => response.json())
                    .then(post => {
                        const updatedComments = post.comments.filter(id => id !== selectedCommentId);
                        const updatedData = { ...post, comments: updatedComments };
                        return fetch(`http://localhost:5001/posts/${postId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedData)
                        });
                    })
                    .then(()=>window.location.reload());
    }
}

function updateCommentButtonState() {
    if ($commentInput.value.trim() !== '') {
        $commentSubmitBtn.style.backgroundColor = '#7F6AEE';
    } else {
        $commentSubmitBtn.style.backgroundColor = '#ACA0EB';
    }
}

function clickCommentSubmitBtn() {
    if ($commentInput.value.trim() !== '') {
        fetch('http://localhost:5001/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: postId,
                writerId: 1, // 일단 임시로 1로 설정
                content: $commentInput.value,
                date: new Date().toISOString()
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }})
            .then(comment => {
                console.log("comment: ", comment);
                fetch(`http://localhost:5001/posts/${postId}`)
                .then(response => response.json())
                .then(post => {
                    // 기존 comments 배열에 새 댓글 ID 추가
                    const updatedComments = [...post.comments, comment.id];

                    // 기존 데이터에 comments 배열만 업데이트한 객체 생성
                    const updatedData = { ...post, comments: updatedComments };

                    // PUT 요청으로 업데이트된 데이터를 전송
                    return fetch(`http://localhost:5001/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                    });
                })
                .then(response => response.json())
                .then(() => {
                    window.location.reload();
                })
                .catch(error => console.error('Error:', error));
                    })
            }
}

$previousBtn.addEventListener('click', clickPreviousBtn);
$postEditBtn.addEventListener("click", clickPostEditBtn);
$postDeleteBtn.addEventListener("click", clickPostDeleteBtn);
$modalCancelBtns.forEach(cancelBtn => {
    cancelBtn.addEventListener("click", clickCancelBtn);
});
for (let checkBtn of $modalCheckBtns) {
    checkBtn.addEventListener("click", clickCheckBtn);
}
$commentInput.addEventListener("input", updateCommentButtonState);
$commentSubmitBtn.addEventListener("click", clickCommentSubmitBtn);


const $headerProfileImg = document.querySelector('#headerProfileImg');
const $dropdownMenu = document.querySelector('.dropdown-menu');
$headerProfileImg.addEventListener('click', ()=>{
    if($dropdownMenu.style.display === 'block') 
        $dropdownMenu.style.display = 'none';
    else
        $dropdownMenu.style.display = 'block';
});

const $memInfoModi = document.querySelector('.dropdown-menu li:nth-child(1)');
const $passModi = document.querySelector('.dropdown-menu li:nth-child(2)');
const $logout = document.querySelector('.dropdown-menu li:nth-child(3)');

$memInfoModi.addEventListener('click', ()=>{
    location.href = '/memInfoModi';
});

$passModi.addEventListener('click', ()=>{
    location.href = '/passModi';
});

$logout.addEventListener('click', ()=>{
    location.href = '/logout';
});
