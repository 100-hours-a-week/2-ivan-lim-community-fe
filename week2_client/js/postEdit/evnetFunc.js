import {user_id, postId} from './postEdit.js';
const $previousBtn = document.querySelector('header > button');

$previousBtn.addEventListener('click', ()=>{
    window.location.href = "/listInquiry";
});

// 이미지 파일 선택 이벤트
const $fileInput = document.getElementById("fileInput");
const $uploadMessage = document.getElementById("uploadMessage");
const $uploadButton = document.getElementById("uploadButton");

$uploadButton.addEventListener("click", () => {
    $fileInput.click();
});

$fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; // 첫 번째 파일만 가져옴
    if (file) {
    console.log(file);
    }
    // $fileInput.value = ""; // 선택 초기화. 굳이 안해도 된다. 오히려 안해야 change 이벤트가 발생하지 않아서 이득.

    $uploadMessage.textContent = file.name;
});

// 프로필 이미지 클릭시 드롭다운으로 클릭 가능. 클릭시 각 페이지로 이동. 
// add 필요: hover시 배경색 (E9E9E9)
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

// 버튼 클릭시 api 호출하여 수정된 내용 저장

const $mainBody = document.querySelector('.mainBody');
const $titleInput = document.querySelector("#titleInput");
const $contentInput = document.querySelector(".mainBody--content > textarea");

$mainBody.addEventListener('input', ()=>{

    if($titleInput.value.trim() && $contentInput.value.trim())
        $submitBtn.style.backgroundColor = '#7F6AEE';
    else
        $submitBtn.style.backgroundColor = '#ACA0EB';
});


const $submitBtn = document.querySelector('.mainBody--submit--btn');

// ‘수정하기’ 클릭시
// 수정 성공하면 ‘수정 완료'라는 토스트메시지가 보여진다.

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('show');

    // 일정 시간 후 토스트 메시지 숨기기
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000); // 3초 후 사라짐
};

$submitBtn.addEventListener('click', async ()=>{
    // 둘 중 하나라도 내용이 없으면 제출X
    console.log("click");
    if(!$titleInput.value.trim() || !$contentInput.value.trim())
    {
        console.log("trim");
        return;
    }
    console.log("not trim")

    const formData = new FormData();
    formData.append('writerId',user_id);
    formData.append('newTitle', $titleInput.value);
    formData.append('newContent', $contentInput.value);
    if ($fileInput.files[0]) {
        formData.append('newImage', $fileInput.files[0]); // 파일 추가
    }

    console.log("before fetch");
    
    try{
        const response = await fetch(`http://localhost:3030/api/posts/${postId}`, {
            method: 'PATCH',
            credentials: 'include', // 세션 쿠키를 포함
            body: formData, // FormData 객체 전송
        });
        console.log(response);
        if(!response.ok)
            {
                console.log("PNF");
                throw new Error('Post not found');
            }
            else
            {
                showToast('수정 완료');
                console.log("show")
            }
    }catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        return;
    }
    
});