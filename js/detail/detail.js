import {callUpdateViewApi, getMyLikeState, clickLikeBox} from './detail_function.js';
import {renderHeaderProfileImg} from '../function/render.js';
import {addEventInDropdown} from '../function/commonFuction.js';
import {utcToKst} from '../function/commonFuction.js';
import { beOrigin } from '../env.js';

const $header = document.querySelector('header h1');
$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

const user_id = sessionStorage.getItem('user_id');
// URL에서 ?id=123과 같이 쿼리 문자열로 ID가 포함된 경우
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

renderHeaderProfileImg(user_id);

const $postEditBtn = document.getElementById("postEditBtn");
const $postDeleteBtn = document.getElementById("postDeleteBtn");

try{
    console.log(postId);
    
    let response;
    let jsonResponse;

    response = await fetch(`${beOrigin}/api/posts/permissionCheck/${postId}`,{
        method: 'GET',
        credentials: 'include', // 세션 쿠키를 포함
        });
    if(!response.ok)
    {
        $postEditBtn.style.display = 'none';
        $postDeleteBtn.style.display = 'none';
    }

    await callUpdateViewApi(postId);
    response = await fetch(`${beOrigin}/api/posts/${postId}`)
    jsonResponse = await response.json();
    const post = jsonResponse.data;
    
    response = await fetch(`${beOrigin}/api/users/${post.writerId}`);
    jsonResponse = await response.json();
    const user = jsonResponse.data;

    updatePostContent(post, user);
}catch(error){
    console.error('Error:', error);
}


async function updatePostContent(post,user) {
    const $title= document.querySelector('.mainWrap--header h2');
    $title.textContent = post.title;

    const $profileImage = document.querySelector('.mainWrap--header img');
    $profileImage.src = user.profileImgPath ? `${beOrigin}/userProfileImg/${user.profileImgPath}` : `${beOrigin}/userProfileImg/default.png`;

    const $writerName = document.getElementById('writer');
    $writerName.textContent = user.nickname;

    const $postDate = document.getElementById('time');
    $postDate.textContent = utcToKst(post.date);

    const $postImage = document.querySelector('.mainWrap > img');
    $postImage.src = `${beOrigin}/postImg/${post.imagePath ?? 'default.png'}`;

    const $postContent = document.querySelector('.mainWrap--content > p');
    $postContent.textContent = post.content;

    const $likeCount = document.getElementById('like');
    const $viewCount = document.getElementById('view');
    const $commentCount = document.getElementById('comment');

    $likeCount.textContent = post.like;
    $viewCount.textContent = post.view;
    $commentCount.textContent = post.comment;

    const $likeBox = document.querySelector('.mainWrap--countBox--content:first-of-type');

    if(user_id)
    {
        if(await getMyLikeState(postId))
        {
            $likeBox.dataset.liked = 'true';
            $likeBox.style.backgroundColor = '#3b72f2';
        }
        else
        {
            $likeBox.dataset.liked = 'false';
            $likeBox.style.backgroundColor = '#D9D9D9';
        }
        console.log($likeBox.dataset.liked);
    }
    $likeBox.addEventListener('click', (event) => clickLikeBox(postId, $likeBox, $likeCount));

    const response = await fetch(`${beOrigin}/api/comments/${postId}`)
    const jsonResponse = await response.json();
    if(!response.ok)
        throw new Error(jsonResponse.message);
    const comments = jsonResponse.data.comments;
    renderComments(comments);
}

async function renderComments(comments) {
    const $mainWrap = document.querySelector('.mainWrap');
    let $historyBox;
    let $editBtn;
    let $deleteBtn;

    comments = comments.slice().reverse();
    for (let comment of comments) {
        const response = await fetch(`${beOrigin}/api/users/${comment.writerId}`);
        const jsonResponse = await response.json();
        const user = jsonResponse.data;
        
        $historyBox = document.createElement('div');
        $historyBox.classList.add('mainWrap--historyBox');
        $historyBox.innerHTML = `<div class="mainWrap--historyBox">
            <div class="mainWrap--historyBox--leftBox">
                <div class="mainWrap--historyBox--leftBox--top">
                    <span>
                        <img class="userProfileImg" src="${beOrigin}/userProfileImg/${user.profileImgPath ?? 'default.png'}" crossOrigin ="anonymous" alt="춘식" />
                    </span>
                    <span id="user-${user.userId}"></span>
                    <span id="time">${utcToKst(comment.date)}</span>
                </div>
                <div class="mainWrap--historyBox--leftBox--bottom">
                    <p id="content-${comment.id}"></p>
                </div>
            </div>
            <div class="mainWrap--historyBox--rightBox">
                <button class="optionBtn edit-${comment.id}">수정</button>
                <button class="optionBtn delete-${comment.id}">삭제</buton>
            </div>
        </div>`;
        // xss 공격 위험이 있는 요소들에 대해 innerText로 처리
        const writer = $historyBox.querySelector(`#user-${user.userId}`);
        writer.textContent = user.nickname
        const commentContent = $historyBox.querySelector(`#content-${comment.id}`);
        commentContent.textContent = comment.content;
        
        $mainWrap.appendChild($historyBox);
        $editBtn = $historyBox.querySelector(`.edit-${comment.id}`);
        $deleteBtn = $historyBox.querySelector(`.delete-${comment.id}`);
        console.log(typeof user_id);
        if(parseInt(user_id) === comment.writerId)
        {
            // id 전달해야 함.
            $editBtn.addEventListener('click', () => clickCommentEditBtn(comment.id));
            $deleteBtn.addEventListener('click', () => clickCommentDeleteBtn(comment.id));
        }
        else
        {
            $editBtn.style.display = 'none';
            $deleteBtn.style.display = 'none';
        }

        function clickCommentEditBtn(commentId) {
            const $editBtn = document.querySelector(`.edit-${commentId}`);
            const $deleteBtn = document.querySelector(`.delete-${commentId}`);

            $editBtn.style.display = 'none';
            $deleteBtn.style.display = 'none';

            const $commentContent = document.querySelector(`#content-${commentId}`);
            
            $commentContent.classList.add('comment-edit'); // 원하는 클래스 추가
            
            $commentContent.contentEditable = true;
            // 포커스 이동
            commentContent.focus();

            // 포커스 위치를 마지막으로 이동 (선택사항)
            const range = document.createRange(); // 범위 생성
            const selection = window.getSelection(); // 현재 선택 영역 가져오기
            range.selectNodeContents(commentContent); // 내용의 끝으로 범위 설정
            range.collapse(false); // 범위를 끝으로 이동
            selection.removeAllRanges(); // 기존 선택 영역 제거
            selection.addRange(range); // 새로운 범위 추가

            $commentContent.style.borderBottom = '2px solid';
            $commentContent.style.borderBottomColor = '#3b72f2';
            
            // 저장 버튼 생성
            const $saveButton = document.createElement('button');
            $saveButton.textContent = '저장';
            $saveButton.classList.add('optionBtn'); // 원하는 클래스 추가
            document.querySelector(`.edit-${commentId}`).parentNode.appendChild($saveButton);
            
            $commentContent.addEventListener('focusout', () => {
                console.log('focusout');
                $saveButton.click();
            });

            $saveButton.addEventListener('click', async () => {
                let response;

                if($commentContent.textContent.trim() !== '') {
                    // 1. HTML 내용 가져오기
                    const htmlContent = commentContent.innerHTML;
                    
                    // 2. HTML 개행 태그를 텍스트 개행으로 변환
                    const textWithNewlines = htmlContent
                        .replace(/<br\s*\/?>/gi, "\n") // <br> 태그를 \n으로 변환
                        .replace(/<\/div>/gi, "") // <div> 종료 태그 제거
                        .replace(/<div>/gi, "\n") // <div> 시작 태그를 \n으로 변환
                        .trim(); // 불필요한 공백 제거

                    response = await fetch(`${beOrigin}/api/comments/${commentId}`, { // 댓글 수정
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            writerId : user_id,
                            newContent: textWithNewlines
                        })
                    });
                    if(!response.ok) 
                    {
                        const jsonResponse = await response.json();
                        throw new Error(jsonResponse.message);
                    }
                }
                $commentContent.classList.remove('comment-edit'); // 원하는 클래스 제거
                $commentContent.contentEditable = false;
                $commentContent.style.borderBottom = 'none';
                $saveButton.remove();
                $commentContent.style.display = 'block';
                $editBtn.style.display = 'inline-block';
                $deleteBtn.style.display = 'inline-block';
            }
        );
        }

        function clickCommentDeleteBtn(commentId){
            const $modalContentHeader = document.querySelector('.modalContent--header')
            $modalContentHeader.textContent = '댓글을 삭제하시겠습니까?';
            $modal.style.display = 'flex';
            modalType = CommentModal;
            selectedCommentId = commentId;
        }
            
        };
    }


const $previousBtn = document.querySelector('header > button');

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

// post 수정 버튼 클릭시
function clickPostEditBtn() {
    window.location.href = "/postEdit?id=" + postId;
}
// post 삭제 버튼 클릭시
function clickPostDeleteBtn() {
    const $modalContentHeader = document.querySelector('.modalContent--header')
    $modalContentHeader.textContent = '게시글을 삭제하시겠습니까?';
    modalType = PostModal;
    $modal.style.display = 'flex';
}

function clickCancelBtn() {
    $modal.style.display = 'none';
}

async function clickCheckBtn() {
    if(modalType === PostModal) { // 게시글 삭제
        fetch(`${beOrigin}/api/posts/${postId}`, {
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
        const response = await fetch(`${beOrigin}/api/comments/${selectedCommentId}`, {
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
            const jsonResponse = await response.json();
            throw new Error(jsonResponse.message);
        }
        else
            window.location.reload();
    }
}

function editCommentButtonState() {
    if (user_id && $commentInput.value.trim() !== '') {
        $commentSubmitBtn.style.backgroundColor = '#3b72f2';
    } else {
        $commentSubmitBtn.style.backgroundColor = '#a0b7eb';
    }
}

async function clickCommentSubmitBtn(event) { // 댓글 추가 작성
    event.preventDefault();
    if ($commentInput.value.trim() !== '') {
        const response = await fetch(`${beOrigin}/api/comments/${postId}`, {
            method: 'POST',
            credentials: 'include', // 쿠키를 포함하도록 설정
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                writerId: user_id,
                content: $commentInput.value,
            })
        })
        if (!response.ok) {
            const jsonResponse = await response.json();
            throw new Error(jsonResponse.message);
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

addEventInDropdown();
