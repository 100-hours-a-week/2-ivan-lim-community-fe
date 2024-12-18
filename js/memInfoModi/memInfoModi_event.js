// 프로필 이미지 클릭시 드롭다운으로 클릭 가능 hover시 배경색 (E9E9E9)
// 클릭시 각 페이지로 이동
import {$headerProfileImg, user_id, nickname} from './memInfoModi.js';
import {duplicateNicknameChk} from '../function/apiClient.js';
import {renderHeaderProfileImg} from '../function/render.js';
import {addEventInDropdown, showToast} from '../function/commonFuction.js';
import { beOrigin } from '../env.js';

const $dropdownMenu = document.querySelector('.dropdown-menu');
$headerProfileImg.addEventListener('click', ()=>{
    if($dropdownMenu.style.display === 'block') 
        $dropdownMenu.style.display = 'none';
    else
        $dropdownMenu.style.display = 'block';
});

renderHeaderProfileImg(user_id, $headerProfileImg);

addEventInDropdown();


// ‘수정하기’ 버튼을 클릭했을 때 
// 닉네임 입력하지 않을 시 : *닉네임을 입력해주세요.
// 닉네임 중복 시 : *중복된 닉네임 입니다. 
// 닉네임 11자 이상 작성시 : *닉네임은 최대 10자 까지 작성 가능합니다.

const $nicknameInput = document.querySelector('#nicknameInput');
const $nicknameHelperText = document.querySelector('.helper-text');
const $modiBtn = document.querySelector('#modiBtn');
let canModi = false;
let imgChangeState = false;


$nicknameInput.addEventListener('input', async ()=>{
    canModi = false;
    if($nicknameInput.value.trim() === nickname)
    {
        $nicknameHelperText.style.display = 'none';
        if(imgChangeState)
            $modiBtn.style.backgroundColor = '#7F6AEE';
        else
            $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else if($nicknameInput.value.length > 10){
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else if($nicknameInput.value.trim() === ''){
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
        $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else
    {
        debounceTimeout = setTimeout(async () => {
            if(await duplicateNicknameChk($nicknameInput.value)){
                $nicknameHelperText.style.display = 'block';
                $nicknameHelperText.textContent = "*중복된 닉네임 입니다.";
                $modiBtn.style.backgroundColor = '#ACA0EB';
            }
            else{
                $nicknameHelperText.style.display = 'none';
                $modiBtn.style.backgroundColor = '#7F6AEE';
                canModi = true;
            }
    }), 300};
});

// 프로필 변경 이벤트.
const $profileChangeBtn = document.querySelector('#profileChangeBtn');
const $profileImg = document.querySelector('#profileImg');
const $fileInput = document.querySelector('#fileInput');

$profileChangeBtn.addEventListener('click', ()=>{
    $fileInput.click();
});

try{
    const response = await fetch(`${beOrigin}/api/users/${user_id}`);
    if(response.ok)
    {
        const jsonResponse = await response.json();
        const user = jsonResponse.data;
        console.log(user);
        $profileImg.src = user.profileImgPath ? `${beOrigin}/userProfileImg/${user.profileImgPath}` : `${beOrigin}/userProfileImg/default.png`;
    }
}catch(e){
    console.error('There was a problem with your fetch operation:', error);
}

$profileImg.addEventListener('click', ()=>{
    $fileInput.click();
});

$fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    $profileImg.src = URL.createObjectURL(file);
    $profileImg.onload = () => {
        URL.revokeObjectURL($profileImg.src); // free memory
    };
    imgChangeState = true;
    $modiBtn.style.backgroundColor = '#7F6AEE';
});


// ‘수정하기’ 클릭시
// 수정 성공하면 ‘수정 완료'라는 토스트메시지가 보여진다.
$modiBtn.addEventListener('click', async (event)=>{
    event.preventDefault(); // 폼이 실제로 제출되는 것을 막음
    try{
        if(canModi)
        {
            // 필요한 데이터가 form 밖에 있으므로 FormData 객체를 생성하여 데이터 추가하는 방법.
            const f_formData = new FormData();

            // 닉네임 추가
            f_formData.append('newNickname', $nicknameInput.value);

            const f_response = await fetch(`${beOrigin}/api/users/${user_id}`, {
                method: 'PATCH',
                credentials: 'include', // 세션 쿠키를 포함
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(f_formData).toString()
            });
            const f_jsonResponse = await f_response.json();
            if (!f_response.ok)
                throw new Error(f_jsonResponse.message);
            if($fileInput.files[0] === undefined)
            {
                showToast('수정 완료');
                return;
            }
        }
    if(imgChangeState)
    {
        const s_formData = new FormData();
        s_formData.append('profileImg', $fileInput.files[0]); // 실제 파일 객체 추가
        const s_response = await fetch(`${beOrigin}/api/users/uploadImg`, {
            method: 'POST',
            credentials: 'include', // 세션 쿠키를 포함
            body: s_formData,
        });
        if(s_response.ok)
            showToast('수정 완료');
        else
        {
            const s_responseJson = await s_response.json();
            throw new Error(s_responseJson.message);
        }
    }
    }catch(e){
        console.error('There was a problem with your fetch operation:', error);
    }
    
});

// 회원탈퇴 클릭시 회원 탈퇴 확인 모달이 나온다- 확인 클릭시 회원 탈퇴가 완료되고, 로그인페이지로 이동한다.

const $withdrawlBox = document.querySelector('#withdrawlBox');
const $modal = document.querySelector('.modal');
const $modalCancelBtn = document.querySelector('.modalContent--cancelBtn');
const $modalCheckBtn = document.querySelector('.modalContent--checkBtn');

$withdrawlBox.addEventListener('click', (event)=>{
    event.preventDefault();
    $modal.style.display = 'flex';
});

$modalCancelBtn.addEventListener('click', ()=>{
    $modal.style.display = 'none';
});

$modalCheckBtn.addEventListener('click', async (event)=>{
    event.preventDefault();
    const response = await fetch(`${beOrigin}/api/users/${user_id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if(response.ok)
    {
        localStorage.removeItem('user_id');
        location.href = '/listInquiry';
    }
});