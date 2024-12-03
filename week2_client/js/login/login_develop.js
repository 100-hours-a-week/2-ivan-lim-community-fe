const $header = document.querySelector('header h1');
const $form = document.querySelector('.mainWrap--loginForm');
const $email = document.querySelector('#email');
const $password = document.getElementById('password');
const $helperText = document.querySelector('.helper-text');

let passwordBool = true;

$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

const lottieContainer = document.getElementById('lottie-container');

$form.addEventListener('submit', async function(event) {
    event.preventDefault(); // 폼이 실제로 제출되는 것을 막음

    console.log($email.value); // email input에 있는 값 출력
    if ($email.validity.typeMismatch)
        $email.setCustomValidity("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
    else if(passwordBool)
    {
        const form = event.target;
        const formData = new FormData(form);

        try{
            const response = await fetch('http://localhost:3030/api/guests/login', {
                method: 'POST',
                credentials: 'include', // 쿠키를 포함하도록 설정
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });
    
            if (response.ok) {
                const user = await response.json();
                console.log(user);
                localStorage.setItem('user_id', user.data.userId);
                window.location.href = '/listInquiry';
            }
            else
                throw new Error('로그인 실패');
        }catch(error){
            console.error(error);
        }
    }
});

$password.addEventListener('input', function() {
    const passwordValue = $password.value;

    if (!passwordValue) {
        // 비밀번호가 입력되지 않았을 때 메시지 설정 및 표시
        $helperText.textContent = '* 비밀번호를 입력해주세요';
        $helperText.style.display = 'block';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(passwordValue)) {
        $helperText.textContent = '* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
        $helperText.style.display = 'block';
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