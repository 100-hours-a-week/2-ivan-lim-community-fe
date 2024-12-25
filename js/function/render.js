import { beOrigin } from '../env.js';

// headerProfileImg에 사용자 프로필 이미지 삽입
export async function renderHeaderProfileImg(user_id)
{
    const $headerProfileImg = document.querySelector('#headerProfileImg');   
    const $loginLogoutBtn = document.querySelector('.dropdown-menu li:nth-child(3)');
    $headerProfileImg.src = `${beOrigin}/userProfileImg/default.png`;
    if(user_id)
    {
        try{
            const response = await fetch(`${beOrigin}/api/users/${user_id}`);
            const responseJson = await response.json();
            if(!response.ok)
            {
                $loginLogoutBtn.textContent = '로그인';
                throw new Error(responseJson.message);
            }
            const user = responseJson.data;
            $headerProfileImg.src = `${beOrigin}/userProfileImg/${user.profileImgPath ?? 'default.png'}`;
        }catch(error){
        console.error('There was a problem with your fetch operation:', error);
        }  
    }
    else
        $loginLogoutBtn.textContent = '로그인';


    $headerProfileImg.addEventListener('click', ()=>{
        if($dropdownMenu.style.display === 'block') 
            $dropdownMenu.style.display = 'none';
        else
            $dropdownMenu.style.display = 'block';
    });
    
    const $dropdownMenu = document.querySelector('.dropdown-menu');
    document.addEventListener('click', (event) => {
        // 드롭다운 메뉴나 이미지 외부를 클릭했을 때만 닫기
        if (
            !$headerProfileImg.contains(event.target) &&
            !$dropdownMenu.contains(event.target)
        ) {
            $dropdownMenu.style.display = 'none';
        }
    });


}
