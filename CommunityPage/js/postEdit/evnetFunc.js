const $previousBtn = document.querySelector('header > button');

const $fileInput = document.getElementById("fileInput");
const $uploadMessage = document.getElementById("uploadMessage");
const $uploadButton = document.getElementById("uploadButton");

$previousBtn.addEventListener('click', ()=>{
    window.location.href = "/listInquiry";
});

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
