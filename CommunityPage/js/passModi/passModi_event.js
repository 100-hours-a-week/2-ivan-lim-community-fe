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


// 비밀번호 Input에 입력하지 않거나 유효성 검사를 통과하지 못할 경우
// 유효성 검사 : *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.
// 비밀번호 input
// 비밀번호 입력 안했을 시 : *비밀번호를 입력해주세요

const $passwordInput = document.querySelector('#password');
const $pwHelperText = document.querySelector('#pwHelperText');

function passwordValidChk(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
}

$passwordInput.addEventListener('input', function() {
    if($passwordInput.value === '') {
        $pwHelperText.style.display = 'block';
        $pwHelperText.textContent = '*비밀번호를 입력해주세요.';
    }
    else if(!passwordValidChk($passwordInput.value)) {
        $pwHelperText.style.display = 'block';
        $pwHelperText.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    else {
        $pwHelperText.style.display = 'none';
    }
});


// 비밀번호가 확인과 다를시 : *비밀번호 확인과 다릅니다.
// 비밀번호 확인 input
// 비밀번호 확인 입력 안했을 시 :*비밀번호를 한번 더 입력해주세요
// 비밀번호 확인이 비밀번호 다를시 : *비밀번호와 다릅니다.
const $passwordCheckInput = document.querySelector('#passwordChk');
const $pwChkHelperText = document.querySelector('#pwChkHelperText');

$passwordCheckInput.addEventListener('input', function() {
    if($passwordCheckInput.value === '') {
        $pwChkHelperText.style.display = 'block';
        $pwChkHelperText.textContent = '*비밀번호를 한번 더 입력해주세요.';
    }
    else if($passwordInput.value !== $passwordCheckInput.value) {
        $pwChkHelperText.style.display = 'block';
        $pwChkHelperText.textContent = '*비밀번호와 다릅니다.';
    }
    else {
        $pwChkHelperText.style.display = 'none';
    }
});

// 모든 정보를 입력하고 유효성검사를 통과했을 시 활성화 ( ACA0EB > 7F6AEE) 된다.
// ‘수정하기’ 클릭시 수정 성공하면 ‘수정 완료'라는 토스트메시지가 보여진다.

const $inputs = document.querySelectorAll('input');
const $submitBtn = document.querySelector('#submitBtn');
const $toast = document.querySelector('.toast');

function allInputValidChk() {
    if($pwHelperText.style.display === 'none' && $pwChkHelperText.style.display === 'none') {
        $submitBtn.style.backgroundColor = '#7F6AEE';
    }
    else {
        $submitBtn.style.backgroundColor = '#ACA0EB';
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.add('show');

    // 일정 시간 후 토스트 메시지 숨기기
    setTimeout(() => {
        toastMessage.classList.remove('show');
    }, 3000); // 3초 후 사라짐
};

$inputs.forEach(input => {
    input.addEventListener('input', allInputValidChk);
});

$submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if($pwHelperText.style.display === 'none' && $pwChkHelperText.style.display === 'none') {
        // db 비밀번호 수정
        showToast('수정 완료');
    }
});