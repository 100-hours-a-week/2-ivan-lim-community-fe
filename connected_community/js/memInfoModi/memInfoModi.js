// 이메일 가져오기

const $eamil = document.querySelector('#email');

// fix 필요: 클라이언트가 인증 토큰을 들고 요청하도록.
const response = await fetch("http://localhost:3030/api/users/1"); // 일단 user_id 1로 고정. fix 필요.
if(response.ok)
{
    const responseData = await response.json(); // JSON 형식으로 응답 데이터 파싱
    const data = responseData.data; // 응답 데이터에서 data 객체 가져오기
    const email = data?.email; // optional chaining으로 안전하게 접근
    $eamil.textContent = email;
}

// // 프로필 사진 가져오기

const $headerProfileImg = document.querySelector('#headerProfileImg');

export { $headerProfileImg };
// const $profileImg = document.querySelector('#profileImg');

// // $headerProfileImg.src = 
// // $profileImg.src = 