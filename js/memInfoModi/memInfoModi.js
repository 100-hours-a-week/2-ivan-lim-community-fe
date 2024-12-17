import { beOrigin } from '../env.js';

const $eamil = document.querySelector('#email');

const user_id = localStorage.getItem('user_id');
if(!user_id) {
    location.href = '/login';
}

const response = await fetch(`${beOrigin}/api/users/${user_id}`,{
    method: 'GET',
    credentials: 'include', // 세션 쿠키를 포함
    });
if(response.ok)
{
    const responseData = await response.json(); // JSON 형식으로 응답 데이터 파싱
    const data = responseData.data; // 응답 데이터에서 data 객체 가져오기
    const email = data?.email; // optional chaining으로 안전하게 접근
    $eamil.textContent = email;
}

const $header = document.querySelector('header h1');
$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});
const $headerProfileImg = document.querySelector('#headerProfileImg');

export { $headerProfileImg, user_id };
