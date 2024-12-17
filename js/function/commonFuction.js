import { beOrigin } from '../env.js';

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
            const response = fetch('${beOrigin}/api/users/logout',{
                method: 'POST',
                credentials: 'include', // 세션 쿠키를 포함
            });
            localStorage.removeItem('user_id');
            location.href = '/listInquiry';
        }
    });
}

export function utcToKst(stringDate)
{
    const date = new Date(stringDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 원하는 형식으로 조합
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
