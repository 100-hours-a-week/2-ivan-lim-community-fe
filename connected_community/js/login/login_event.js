const $header = document.querySelector('header h1');
const $form = document.querySelector('.mainWrap--loginForm');
const $email = document.querySelector('#email');
const $password = document.getElementById('password');
const $helperText = document.querySelector('.helper-text');

let passwordBool = false;

$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

$form.addEventListener('submit', async function(event) {
    event.preventDefault(); // 폼이 실제로 제출되는 것을 막음

    console.log($email.value); // email input에 있는 값 출력
    if ($email.validity.typeMismatch)
        $email.setCustomValidity("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
    else if(passwordBool)
    {
        const form = event.target;
        const formData = new FormData(form);
        // const response = await fetch('http://localhost:3030/api/guests/login', {
        //     method: 'POST',
        //     body: formData
        // }); FormData 객체를 body로 전달하면, '브라우저'가 자동으로 Content-Type을 multipart/form-data로 설정

        // 이를 x-www-form-urlencoded 형식으로 변환해주는 URLSearchParams 객체를 사용
        const response = await fetch('http://localhost:3030/api/guests/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
            window.location.href = '/listInquiry';
        }
        // else면 보통 뭘 하지?
    }
});

$password.addEventListener('input', function() {
    const passwordValue = $password.value;

    if (!passwordValue) {
        // 비밀번호가 입력되지 않았을 때 메시지 설정 및 표시
        $helperText.textContent = '* 비밀번호를 입력해주세요';
        $helperText.style.display = 'block';
        passwordBool = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(passwordValue)) {
        $helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        $helperText.style.display = 'block';
        passwordBool = false;
    } else {
        // 유효성 검사를 통과하면 helperText 숨기기
        passwordBool = true;
        $helperText.style.display = 'none';
    }
});

const $inputs = document.querySelectorAll('input');
const $submitBtn = document.querySelector('button');
$inputs.forEach(function(input) {
    input.addEventListener('input', function() {
        if($email.validity.typeMismatch || !passwordBool)
            $submitBtn.style.backgroundColor = '#ACA0EB';
        else
            $submitBtn.style.backgroundColor = '#7F6AEE'; 
    }
    );
});