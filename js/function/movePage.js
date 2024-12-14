export function addEventInHeader() {
    const $header = document.querySelector('header h1');
    $header.addEventListener('click', function() {
        window.location.href = '/listInquiry'; // 홈 화면으로 이동
    });
}

export function addEventInDropdown() {
    const $memInfoModi = document.querySelector('.dropdown-menu li:nth-child(1)');
    const $passModi = document.querySelector('.dropdown-menu li:nth-child(2)');
    const $loginLogoutBtn = document.querySelector('.dropdown-menu li:nth-child(3)');
    
    $memInfoModi.addEventListener('click', ()=>{
        location.href = '/memInfoModi';
    });
    
    $passModi.addEventListener('click', ()=>{
        location.href = '/passModi';
    });
    
    $loginLogoutBtn.addEventListener('click', ()=>{
        if($loginLogoutBtn.textContent === '로그인')
            location.href = '/login';
        else if($loginLogoutBtn.textContent === '로그아웃')
        {
            const response = fetch('http://localhost:3030/api/users/logout',{
                method: 'POST',
                credentials: 'include', // 세션 쿠키를 포함
            });
            localStorage.removeItem('user_id');
            location.href = '/listInquiry';
        }
    });
}
