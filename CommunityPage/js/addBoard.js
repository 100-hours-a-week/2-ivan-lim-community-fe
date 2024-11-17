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
    if (file) {
    console.log(file);
    }
    $fileInput.value = ""; // 선택 초기화

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
        $titleInput.value = titleInput.value.slice(0, 26);
    }
}

function clickSubmitBtn() {
    if ($titleInput.value.trim() === '' || $contentInput.value.trim() === '') {
        $helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
        $helperText.style.display = 'block';
    }
    else{
        fetch('http://localhost:5001/posts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        writerId: 1,
        title: $titleInput.value,
        content: $contentInput.value,
        date: new Date().toISOString(),
        comments: [],
        like: 0,
        view: 0
    })
})
.then(() => 
    window.location.href = "/listInquiry")
.catch(error => console.error('Error:', error));
    }
}

$previousBtn.addEventListener('click', clickPreviousBtn);
$titleInput.addEventListener('input', updateButtonState);
$titleInput.addEventListener('input', limitTitleLength);
$contentInput.addEventListener('input', updateButtonState);
$submitButton.addEventListener('click', clickSubmitBtn);

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
