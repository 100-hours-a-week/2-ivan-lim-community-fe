// 프로필 이미지 클릭시 드롭다운으로 클릭 가능 hover시 배경색 (E9E9E9)
// 클릭시 각 페이지로 이동

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


// ‘수정하기’ 버튼을 클릭했을 때 
// 닉네임 입력하지 않을 시 : *닉네임을 입력해주세요.
// 닉네임 중복 시 : *중복된 닉네임 입니다. 
// 닉네임 11자 이상 작성시 : *닉네임은 최대 10자 까지 작성 가능합니다.

// ‘수정하기’ 클릭시
// 수정 성공하면 ‘수정 완료'라는 토스트메시지가 보여진다.

const $nicknameInput = document.querySelector('#nicknameInput');
const $nicknameHelperText = document.querySelector('.helper-text');
const $modiBtn = document.querySelector('#modiBtn');
let canModi = false;

async function duplicateNicknameChk(nickname) {
    const response = await fetch("/data.json");
    const data = await response.json();
    const nicknames = data.users.map(user => user.name);
    return nicknames.includes(nickname);
}

$nicknameInput.addEventListener('input', async ()=>{
    canModi = false;
    if($nicknameInput.value.length > 10){
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else if($nicknameInput.value.trim() === ''){
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
        $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else if(await duplicateNicknameChk($nicknameInput.value)){
        $nicknameHelperText.style.display = 'block';
        $nicknameHelperText.textContent = "*중복된 닉네임 입니다.";
        $modiBtn.style.backgroundColor = '#ACA0EB';
    }
    else{
        $nicknameHelperText.style.display = 'none';
        $modiBtn.style.backgroundColor = '#7F6AEE';
        canModi = true;
    }
});

$modiBtn.addEventListener('click', (event)=>{
    if(canModi)
    {
        // db 수정
    }
    else
        event.preventDefault(); // 폼이 실제로 제출되는 것을 막음
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

$modalCheckBtn.addEventListener('click', ()=>{
    // 회원 탈퇴
    location.href = '/login';
});

// 프로필 변경 버튼 클릭 addboard참고
const $profileChangeBtn = document.querySelector('#profileChangeBtn');
