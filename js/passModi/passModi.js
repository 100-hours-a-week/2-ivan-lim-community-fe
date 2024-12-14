const $header = document.querySelector('header h1');
$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

const user_id = localStorage.getItem('user_id');
if(!user_id) {
    location.href = '/login';
}

export { user_id };