import {duplicateNicknameChk, duplicateEmailChk} from '../function/apiClient.js';
import { beOrigin } from '../env.js';

const $previousBtn = document.querySelector('header > button');

$previousBtn.addEventListener('click', ()=>{
    window.location.href = "/listInquiry";
});

const $header = document.querySelector('header h1');
$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

// 프로필 사진
// 프로필 사진 업로드 안했을 시 : *프로필 사진을 추가해주세요.

// profileBox 클릭 시 파일 선택 창 열기
const $fileInput = document.getElementById("fileInput");
const $profileBox = document.querySelector('.profileBox');
const $profileHelperText = document.querySelector('#profile-helperText');

$profileBox.addEventListener("click", () => {
    $fileInput.click();
});

$fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; // 첫 번째 파일만 가져옴
    if (file)
        $profileHelperText.style.display = 'none';
    // $fileInput.value = ""; // 선택 초기화. 굳이 안해도 된다. 오히려 안해야 change 이벤트가 발생하지 않아서 이득.
});


// helper text (밀리지 않는다. 지정된 위치에서 보여짐)이메일은 영문과 @, . 만 사용이 가능함
// 인풋값을 입력하다가 포커스아웃될 때
// 이메일이 비어 있는 경우 : 이메일을 입력해주세요.
// 이메일 형식이 너무 짧은 경우, 입력하지 않은 경우, 유효하지 않은 경우 :  *올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)
// 중복된 이메일인 경우 : *중복된 이메일 입니다.

const $emailInput = document.querySelector('#email');
const $eamilHelperText = document.querySelector('#email-helperText');

let debounceTimeout_email;

$emailInput.addEventListener('focusout', async ()=>{
    clearTimeout(debounceTimeout_email); // 이전 타이머 제거

    if($emailInput.value === '') {
        $eamilHelperText.style.display = 'block';
        $eamilHelperText.textContent = '*이메일을 입력해주세요.';
    }
    else if($emailInput.value.length < 5 || !emailValidChk($emailInput.value)) {
        $eamilHelperText.style.display = 'block';
        $eamilHelperText.textContent = '*올바른 이메일 주소 형식을 입력해주세요. (예:example@example.com)';
    }
    else
    {
        debounceTimeout_email = setTimeout(async () => {
            if(await duplicateEmailChk($emailInput.value)) {
                $eamilHelperText.style.display = 'block';
                $eamilHelperText.textContent = '*중복된 이메일 입니다.';
            }
            else {
                $eamilHelperText.style.display = 'none';
                checkConditions();
            }
        }, 300);
    }
});

function emailValidChk(email) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

    if(pattern.test(email) === false) 
        return false; 
    else 
        return true;
}

// 비밀번호, 비밀번호 확인 유효성 : *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.
// 비밀번호 입력 안했을 시 : *비밀번호를 입력해주세요
// 비밀번호가 확인과 다를시 : *비밀번호가 다릅니다.
// 비밀번호 확인 input
// 비밀번호 확인 입력 안했을 시 : *비밀번호를 한번더 입력해주세요
// 비밀번호가 확인과 다를시 : *비밀번호가 다릅니다.

const $passwordInput = document.querySelector('#password');
const $passwordCheckInput = document.querySelector('#passwordCheck');
const $passwordHelperText = document.querySelector('#password-helperText');
const $passwordCheckHelperText = document.querySelector('#passwordCheck-helperText');

$passwordInput.addEventListener('focusout', ()=>{
    if($passwordInput.value === '') {
        $passwordHelperText.style.display = 'block';
        $passwordHelperText.textContent = '*비밀번호를 입력해주세요.';
    }
    else if(!passwordValidChk($passwordInput.value)) {
        $passwordHelperText.style.display = 'block';
        $passwordHelperText.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    else {
        $passwordHelperText.style.display = 'none';
        checkConditions();
    }
});

$passwordCheckInput.addEventListener('focusout', ()=>{
    if($passwordCheckInput.value === '') {
        $passwordCheckHelperText.style.display = 'block';
        $passwordCheckHelperText.textContent = '*비밀번호를 한번더 입력해주세요.';
    }
    else if($passwordInput.value !== $passwordCheckInput.value) {
        $passwordCheckHelperText.style.display = 'block';
        $passwordCheckHelperText.textContent = '*비밀번호가 다릅니다.';
    }
    else {
        $passwordCheckHelperText.style.display = 'none';
        checkConditions();
    }
});

function passwordValidChk(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
}

// 닉네임
// 닉네임 유효성 : 띄어쓰기불가, 10글자 이내
// 닉네임 입력하지 않을 시 : *닉네임을 입력해주세요.
// 닉네임 11자 이상 작성시 : *닉네임은 최대 10자 까지 작성 가능합니다.
// 닉네임에 띄어쓰기 있을 시 : *띄어쓰기를 없애주세요
// 닉네임 중복 시 : *중복된 닉네임 입니다.

const $nicknameInput = document.querySelector('#nickname');
const $nicknameHelperText = document.querySelector('#nickname-helperText');

let debounceTimeout_name;

$nicknameInput.addEventListener('focusout', async ()=>{
    clearTimeout(debounceTimeout_name); // 이전 타이머 제거
    console.log("first");
    if($nicknameInput.value === '') {
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = '*닉네임을 입력해주세요.';
    }
    else if($nicknameInput.value.length > 10) {
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
    }
    else if($nicknameInput.value.includes(' ')) {
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = '*띄어쓰기를 없애주세요.';
    }
    else
    {
        debounceTimeout_name = setTimeout(async () => {
            if(await duplicateNicknameChk($nicknameInput.value)) {
                $nicknameHelperText.style.display = 'block';
                $nicknameHelperText.textContent = '*중복된 닉네임 입니다.';
            }
            else {
                $nicknameHelperText.style.display = 'none';
                checkConditions();
            }
        }, 300);
    }
});

// 회원가입 버튼 
// 1번에 입력한 내용이 모두 작성되고 유효성 검사를 통과한 경우, 버튼이 활성화 된다. (  ACA0EB  > 7F6AEE  )
// 회원가입 버튼 클릭시
// 회원 정보는 저장되고 로그인 페이지로 이동한다.
// 인풋값에 입력한 내용이 부족할 시 버튼이 비활성화된다.

const $joinBtn = document.querySelector('#joinBtn');

function checkConditions()
{
    if($eamilHelperText.style.display === 'none' && $passwordHelperText.style.display === 'none' && $passwordCheckHelperText.style.display === 'none' && $nicknameHelperText.style.display === 'none') {
        $joinBtn.style.backgroundColor = '#7F6AEE';
        $joinBtn.style.cursor = 'pointer';
    }
    else {
        $joinBtn.style.backgroundColor = '#ACA0EB';
        $joinBtn.style.cursor = 'default';
    }
}
// fix필요 : 위의 비동기 함수 때문인지 focuscout이 두번 되어야 활성화가 됨


// form 제출 이벤트
const $form = document.querySelector('.mainWrap--joinForm');
$form.addEventListener('submit', async (event)=>{
    event.preventDefault();
    // 여기도 일단 $profileHelperText.style.display === 'none'인 조건은 뺀 상태.
    if($eamilHelperText.style.display === 'none' && $passwordHelperText.style.display === 'none' && $passwordCheckHelperText.style.display === 'none' && $nicknameHelperText.style.display === 'none') {
        const f_formData = new FormData($form);
        try{
            const f_response = await fetch(`${beOrigin}/api/guests/join`, {
                method: 'POST',
                credentials: 'include', // 쿠키를 받을 수 있도록 설정
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(f_formData).toString()
            });
            if (f_response.ok)
            {
                const f_jsonResponse = await f_response.json();
                const userId = f_jsonResponse.data.userId;
                localStorage.setItem('user_id', userId);
                if($fileInput.files[0] === undefined)
                {
                    window.location.href = "/listInquiry";
                    return;
                }
                const s_formData = new FormData();
                s_formData.append('profileImg', $fileInput.files[0]);
                const s_response = await fetch(`${beOrigin}/api/users/uploadImg/${userId}`, {
                    method: 'POST',
                    body: s_formData,
                });
                if(s_response.ok)
                    window.location.href = "/listInquiry";
                else
                {
                    const s_responseJson = await s_response.json();
                    throw new Error(s_responseJson.message);
                }
            }
        }catch(e){
            console.error(e);
        }
    }
    else
    {
        console.log("회원가입 실패");
    }
});