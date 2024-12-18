export async function clickLikeBox(event, $likeCount)
{
    if(event.target.dataset.liked === 'true')
    {
        event.target.dataset.liked = 'false';
        $likeCount.textContent = parseInt($likeCount.textContent) - 1;
        // add 필요: api 호출
    }
    else
    {
        event.target.dataset.liked = 'true';
        $likeCount.textContent = parseInt($likeCount.textContent) + 1;
    }
}