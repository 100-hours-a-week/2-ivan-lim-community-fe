import {beOrigin} from '../env.js';

export async function getMyLikeState(postId)
{
    try{
        const response = await fetch(`${beOrigin}/api/likes/${postId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const jsonResponse = await response.json();
        if(!response.ok)
        {
            console.log(jsonResponse.message);
            throw new Error(jsonResponse.message);
        }
        return jsonResponse.data.likeState
    }catch(error){
        console.error('There was a problem with your fetch operation:', error);
    }
}

export async function clickLikeBox(event, postId, $likeBox, $likeCount)
{
    if(localStorage.getItem('user_id') === null)
    {
        window.location.href = '/login';
        return;
    }
    if(event.target.dataset.liked === 'true')
    {
        event.target.dataset.liked = 'false';
        $likeBox.style.backgroundColor = '#D9D9D9';
        $likeCount.textContent = parseInt($likeCount.textContent) - 1;
    }
    else
    {
        event.target.dataset.liked = 'true';
        $likeBox.style.backgroundColor = '#7F6AEE';
        $likeCount.textContent = parseInt($likeCount.textContent) + 1;
    }
    try{
        const response = await fetch(`${beOrigin}/api/likes/${postId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        if(!response.ok)
        {
            console.log((await response.json()).message);
            throw new Error((await response.json()).message);
        }
    }catch(error){
        console.error('There was a problem with your fetch operation:', error);
    }
}