import {renderHeaderProfileImg} from '../function/render.js';
import {addEventInDropdown, showToast} from '../function/commonFuction.js';
import {user_id, postId, post} from './postEdit.js';
import { beOrigin } from '../env.js';

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

renderHeaderProfileImg(user_id, $headerProfileImg);

addEventInDropdown();

// 버튼 클릭시 api 호출하여 수정된 내용 저장

const $mainBody = document.querySelector('.mainBody');
const $titleInput = document.querySelector("#titleInput");
const $contentInput = document.querySelector(".mainBody--content > textarea");

$mainBody.addEventListener('input', ()=>{

    if($titleInput.value.trim() && $contentInput.value.trim() && ($titleInput.value.trim() !== post.title || $contentInput.value.trim() !== post.content))
        $submitBtn.style.backgroundColor = '#7F6AEE';
    else
        $submitBtn.style.backgroundColor = '#ACA0EB';
});


// ‘수정하기’ 클릭시
// 수정 성공하면 ‘수정 완료'라는 토스트메시지가 보여진다.
const $submitBtn = document.querySelector('.mainBody--submit--btn');
const $helperText = document.getElementById('helper-text');

$submitBtn.addEventListener('click', async ()=>{
    // 둘 중 하나라도 내용이 없으면 제출X
    console.log("click");
    if(!$titleInput.value.trim() || !$contentInput.value.trim())
    {
        console.log("trim");
        $helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
        $helperText.style.display = 'block';
        return;
    }
    else if($titleInput.value.trim() === post.title && $contentInput.value.trim() === post.content)
        return
    console.log("not trim")

    const f_formData = new FormData();
    f_formData.append('writerId',user_id);
    f_formData.append('newTitle', $titleInput.value);
    f_formData.append('newContent', $contentInput.value);

    console.log("before fetch");
    
    try{
        const f_response = await fetch(`${beOrigin}/api/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(f_formData).toString(),
            credentials: 'include'
        });
        console.log(f_response);
        const f_jsonResponse = await f_response.json();
        if(!f_response.ok)
        {
            console.log("PNF");
            throw new Error(f_jsonResponse.message);
        }
        else
        {
            const postId = f_jsonResponse.data.postId;
            if($fileInput.files[0] === undefined)
            {
                showToast('수정 완료');
                return;
            }
            const s_formData = new FormData();
            s_formData.append('postImg', $fileInput.files[0]); // 파일 추가
            const s_response = await fetch(`${beOrigin}/api/posts/uploadImg/${postId}`, {
                method: 'POST',
                body: s_formData,
                credentials: 'include'
            });
            if (!s_response.ok)
            {
                const s_responseJson = await s_response.json();
                throw new Error(s_responseJson.message);
            }
            else
                showToast('수정 완료');
        }
    }catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        return;
    }
    
});