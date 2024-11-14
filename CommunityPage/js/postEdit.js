$titleInput = document.getElementById('titleInput');
$contentInput = document.querySelector('.mainBody--content textarea');
$submitButton = document.querySelector('.mainBody--submit button');
$helperText = document.getElementById('helper-text');

function limitTitleLength() {
    if ($titleInput.value.length > 26) {
        $titleInput.value = titleInput.value.slice(0, 26);
    }
}

function updateButtonState() {
    if ($titleInput.value.trim() !== '' && $contentInput.value.trim() !== '') {
        $submitButton.style.backgroundColor = '#7F6AEE';
    } else {
        $submitButton.style.backgroundColor = '#ACA0EB';
    }
}

function clickSubmitBtn() {
    console.log('submit button clicked');
    if ($titleInput.value.trim() === '' || $contentInput.value.trim() === '') {
        $helperText.textContent = "*제목, 내용을 모두 작성해주세요.";
        $helperText.style.display = 'block';
    }
    else {
        window.location.href = '/detail'
    }
}


$titleInput.addEventListener('input', limitTitleLength);
$titleInput.addEventListener('input', updateButtonState);
$contentInput.addEventListener('input', updateButtonState);
$submitButton.addEventListener('click', clickSubmitBtn);