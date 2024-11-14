const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

fetch("/data.json")
    .then((res) => res.json())
    .then((data) => {
        const post = data.posts.find(post => post.id === postId);
        renderPost(post);
    });

function renderPost(post) {
    console.log(post.title);
    const $titleInput = document.querySelector("#titleInput");
    $titleInput.value = post.title;

    $contentInput = document.querySelector(".mainBody--content > textarea");
    $contentInput.value = post.content;
    
    const $uploadMessage = document.querySelector("#uploadMessage");
    let imageFileName = post.image.split('/').pop();  
    $uploadMessage.textContent = imageFileName;
    

}


