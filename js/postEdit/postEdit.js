const $header = document.querySelector('header h1');
$header.addEventListener('click', function() {
    window.location.href = '/listInquiry'; // 홈 화면으로 이동
});

const user_id = localStorage.getItem('user_id');
if(!user_id)
    window.location.href = '/login.html';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

try{
    const response = await fetch(`http://localhost:3030/api/posts/${postId}`);
    if(!response.ok)
        throw new Error(response.data);
    const jsonResponse = await response.json();
    const post = jsonResponse.data;
    console.log(post);
    renderPost(post);
}catch(error){
    console.error('There was a problem with your fetch operation:', error);
}

async function renderPost(post) {
    console.log(post.title);
    const $titleInput = document.querySelector("#titleInput");
    $titleInput.value = post.title;

    const $contentInput = document.querySelector(".mainBody--content > textarea");
    $contentInput.value = post.content;
    
    const $uploadMessage = document.querySelector("#uploadMessage");
    $uploadMessage.textContent = post.imagePath ?? "이미지 없음";
}

export {user_id, postId};