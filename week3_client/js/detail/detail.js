const user_id = localStorage.getItem('user_id');
// URL에서 ?id=123과 같이 쿼리 문자열로 ID가 포함된 경우
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
try{
    console.log(postId);
    
    let response = await fetch(`http://localhost:3030/api/posts/${postId}`)
    const jsonResponse = await response.json();
    const post = jsonResponse.data;
    console.log(post);
    
    response = await fetch(`http://localhost:3030/api/users/${post.writerId}`)
    const user = await response.json();
    console.log(user);
    
    updatePostContent(post, user);
}catch(error){
    console.error('Error:', error);
}


async function updatePostContent(post,user) {
    const $title= document.querySelector('.mainWrap--header h2');
    $title.textContent = post.title;

    const $profileImage = document.querySelector('.mainWrap--header img');
    // fix 필요: 현재 user.profileImgPath가 없음
    $profileImage.src = user.profileImgPath ? user.profileImgPath : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    console.log("user.profileImgPath: ", user.profileImgPath);

    const $writerName = document.getElementById('writer');
    $writerName.textContent = user.name;

    const $postDate = document.getElementById('time');
    $postDate.textContent = post.date;

    // const $postImage = document.querySelector('.mainWrap > img');
    // $postImage.src = post.image;

    const $postContent = document.querySelector('.mainWrap--content > p');
    $postContent.textContent = post.content;

    const $likeCount = document.getElementById('like');
    const $viewCount = document.getElementById('view');
    const $commentCount = document.getElementById('comment');
    $likeCount.textContent = post.like;
    $viewCount.textContent = post.view;
    $commentCount.textContent = post.comment;
    const response = await fetch(`http://localhost:3030/api/comments/${postId}`)
    if(!response.ok)
        throw new Error(response.data);
    const jsonResponse = await response.json();
    const comments = jsonResponse.data;
    // $commentCount.textContent = comments.length;
    console.log(comments);

    renderComments(comments);
}

async function renderComments(comments) {
    const $mainWrap = document.querySelector('.mainWrap');
    let $historyBox;
    let $editBtn;
    let $deleteBtn;

    comments = comments.slice().reverse();
    for (let comment of comments) {
        const response = await fetch(`http://localhost:3030/api/users/${comment.writerId}`);
        const jsonResponse = await response.json();
        const user = jsonResponse.data;
        console.log(user);
        $historyBox = document.createElement('div');
        $historyBox.classList.add('mainWrap--historyBox');
        $historyBox.innerHTML = `<div class="mainWrap--historyBox">
            <div class="mainWrap--historyBox--leftBox">
                <div class="mainWrap--historyBox--leftBox--top">
                    <span>
                        <img src="${user.profileImage}" alt="춘식" />
                    </span>
                    <span id="writer">${user.nickname}</span>
                    <span id="time">${comment.date}</span>
                </div>
                <div class="mainWrap--historyBox--leftBox--bottom" id="content-${comment.id}">
                    <p>${comment.content}</p>
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
            const $editBtn = document.querySelector(`.edit-${commentId}`);
            const $deleteBtn = document.querySelector(`.delete-${commentId}`);

            $editBtn.style.display = 'none';
            $deleteBtn.style.display = 'none';

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
            
            $commentEditBox.addEventListener('focusout', () => {
                $saveButton.click();
            });

            $saveButton.addEventListener('click', async () => {
                let response;
                if($commentEditBox.value.trim() !== '') {
                    response = await fetch(`http://localhost:3030/api/comments/${commentId}`, { // 댓글 수정
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            newContent: $commentEditBox.value
                        })
                    });
                    if(response.ok) 
                        $commentContent.textContent = $commentEditBox.value;
                }
                $commentEditBox.remove();
                $saveButton.remove();
                $commentContent.style.display = 'block';
                $editBtn.style.display = 'inline-block';
                $deleteBtn.style.display = 'inline-block';

                if (!response.ok)
                    throw new Error(response.data);
            }
        );
        }

        function clickCommentDeleteBtn(commentId){
            $modal.style.display = 'flex';
            modalType = CommentModal;
            selectedCommentId = commentId;
        }
            
        };
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

async function clickCheckBtn() {
    if(modalType === PostModal) { // 게시글 삭제
        fetch(`http://localhost:3030/api/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                writerId: user_id,
            })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/listInquiry";
                }
            });
        }
    else if(modalType === CommentModal) { // 댓글 삭제
        const response = await fetch(`http://localhost:3030/api/comments/${selectedCommentId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                writerId: user_id,
            })
        });
        if (!response.ok) {
            throw new Error(response.data);
        }
        else
            window.location.reload();
    }
}

function editCommentButtonState() {
    if ($commentInput.value.trim() !== '') {
        $commentSubmitBtn.style.backgroundColor = '#7F6AEE';
    } else {
        $commentSubmitBtn.style.backgroundColor = '#ACA0EB';
    }
}

async function clickCommentSubmitBtn() { // 댓글 추가 작성
    if ($commentInput.value.trim() !== '') {
        const response = await fetch(`http://localhost:3030/api/comments/${postId}`, {
            method: 'POST',
            credentials: 'include', // 쿠키를 포함하도록 설정
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: $commentInput.value,
            })
        })
        if (!response.ok) {
            throw new Error(response.data);
        }
        window.location.reload();
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
$commentInput.addEventListener("input", editCommentButtonState);
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
