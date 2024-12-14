import {renderHeaderProfileImg} from './function/render.js';

const user_id = localStorage.getItem('user_id');

const $previousBtn = document.querySelector('header > button');

const $titleInput = document.getElementById("titleInput");
const $contentInput = document.querySelector('.mainBody--content textarea');
const $helperText = document.getElementById('helper-text');

const $fileInput = document.getElementById("fileInput");
const $uploadMessage = document.getElementById("uploadMessage");
const $uploadButton = document.getElementById("uploadButton");

const $submitButton = document.querySelector('.mainBody--submit button');

// 버튼 클릭 시 파일 선택 창 열기
$uploadButton.addEventListener("click", () => {
    $fileInput.click();
});

$fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; // 첫 번째 파일만 가져옴
    
    // $fileInput.value = ""; // 선택 초기화. 굳이 안해도 된다. 오히려 안해야 change 이벤트가 발생하지 않아서 이득.

    $uploadMessage.textContent = file.name;
});

function clickPreviousBtn() {
    window.location.href = "/listInquiry";
}

// 입력 필드의 값이 변경될 때마다 확인
function updateButtonState() {
    if ($titleInput.value.trim() !== '' && $contentInput.value.trim() !== '') {
        $submitButton.style.backgroundColor = '#7F6AEE';
    } else {
        // $helperText.style.display = 'none';
        $submitButton.style.backgroundColor = '#ACA0EB';
    }
}

function limitTitleLength() {
    if ($titleInput.value.length > 26) {
        $titleInput.value = $titleInput.value.slice(0, 26);
    }
}

async function clickSubmitBtn() {
    if ($titleInput.value.trim() === '' || $contentInput.value.trim() === '') {
        $helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
        $helperText.style.display = 'block';
    }
    else{
        const f_formData = new FormData();
        f_formData.append('title', $titleInput.value);
        f_formData.append('content', $contentInput.value);
        f_formData.append('date', new Date().toISOString());

        try {
            const f_response = await fetch('http://localhost:3030/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(f_formData).toString(),
                credentials: 'include'
            });
            if (!f_response.ok)
                throw new Error(f_response.data);
            else{
                const f_jsonResponse = await f_response.json();
                const postId = f_jsonResponse.data.postId;
                if($fileInput.files[0] === undefined)
                {
                    window.location.href = "/listInquiry";
                    return;
                }
                const s_formData = new FormData();
                s_formData.append('postImg', $fileInput.files[0]);
                const s_response = await fetch(`http://localhost:3030/api/posts/uploadImg/${postId}`, {
                    method: 'POST',
                    body: s_formData,
                    credentials: 'include'
                });
                if (!s_response.ok)
                    throw new Error(s_response.data);
                else
                    window.location.href = "/listInquiry";
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
}

$previousBtn.addEventListener('click', clickPreviousBtn);
$titleInput.addEventListener('input', updateButtonState);
$titleInput.addEventListener('input', limitTitleLength);
$contentInput.addEventListener('input', updateButtonState);
$submitButton.addEventListener('click', clickSubmitBtn);

const $headerProfileImg = document.querySelector('#headerProfileImg');
const $dropdownMenu = document.querySelector('.dropdown-menu');

renderHeaderProfileImg(user_id, $headerProfileImg);


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
