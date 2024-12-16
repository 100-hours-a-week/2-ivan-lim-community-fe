// headerProfileImg에 사용자 프로필 이미지 삽입
export async function renderHeaderProfileImg(user_id, $headerProfileImg)
{
    const $loginLogoutBtn = document.querySelector('.dropdown-menu li:nth-child(3)');
    if(user_id)
    {
        try{
            const response = await fetch(`http://localhost:3030/api/users/${user_id}`);
            const responseJson = await response.json();
            if(!response.ok)
            {
                $loginLogoutBtn.textContent = '로그인';
                throw new Error(responseJson.message);
            }
            const user = responseJson.data;
            $headerProfileImg.src = `http://localhost:3030/userProfileImg/${user.profileImgPath ?? 'default.png'}`;
        }catch(error){
        console.error('There was a problem with your fetch operation:', error);
        }  
    }
    else
        $loginLogoutBtn.textContent = '로그인';
}
