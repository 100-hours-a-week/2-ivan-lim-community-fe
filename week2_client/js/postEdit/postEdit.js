const user_id = localStorage.getItem('user_id');
if(!user_id)
    window.location.href = '/login.html';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

try{
    const response = await fetch(`http://localhost:3030/api/posts/${postId}`);
    if(!response.ok)
        throw new Error('Post not found');
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
    let imageFileName = post.image.split('/').pop();  
    $uploadMessage.textContent = imageFileName;
}

export {user_id, postId};