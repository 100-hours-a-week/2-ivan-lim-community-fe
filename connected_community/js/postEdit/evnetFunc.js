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

import {postId} from './postEdit.js';
const $submitBtn = document.querySelector('.mainBody--submit--btn');

console.log($fileInput.files[0]);
$submitBtn.addEventListener('click', async ()=>{
    if(!$titleInput.value.trim() || !$contentInput.value.trim())
        return;

    // JSON 형식은 파일 데이터를 전송할 수 없습니다. 이미지나 파일 데이터를 전송하려면 FormData 객체를 사용해야 합니다.

    // const response = await fetch(`http://localhost:3030/api/posts/${postId}`, {
    //     method: 'PATCH',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
        // body: JSON.stringify({
        //     newTitle: $titleInput.value,
        //     newContent: $contentInput.value,
        //     newImage: $fileInput.files[0],
        // }),
    // });

    
    const formData = new FormData();
    formData.append('newTitle', $titleInput.value);
    formData.append('newContent', $contentInput.value);
    if ($fileInput.files[0]) {
        formData.append('newImage', $fileInput.files[0]); // 파일 추가
    }

    const response = await fetch('http://localhost:3030/api/posts/c9b2', {
        method: 'PATCH',
        body: formData, // FormData 객체 전송
    });

    if(!response.ok)
        throw new Error('Post not found');
    else
        location.href = '/listInquiry';
});