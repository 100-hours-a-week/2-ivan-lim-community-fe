export async function renderHeaderProfileImg(user_id, $headerProfileImg)
{
    const $loginLogoutBtn = document.querySelector('.dropdown-menu li:nth-child(3)');
    if(user_id)
    {
        try{
            const response = await fetch(`http://localhost:3030/api/users/${user_id}`);
            if(!response.ok)
            {
                $loginLogoutBtn.textContent = '로그인';
                throw new Error(response.data);
            }
            const responseJson = await response.json();
            const user = responseJson.data;
            $headerProfileImg.src = `http://localhost:3030/userProfileImg/${user.profileImgPath ?? 'default.png'}`;
        }catch(error){
        console.error('There was a problem with your fetch operation:', error);
        }  
    }
    else
        $loginLogoutBtn.textContent = '로그인';
}
