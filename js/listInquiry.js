import {renderHeaderProfileImg} from './function/render.js';
import { addEventInDropdown } from './function/commonFuction.js';
import {utcToKst} from './function/commonFuction.js';
const user_id = localStorage.getItem('user_id');

const $headerProfileImg = document.querySelector('#headerProfileImg');

const $dropdownMenu = document.querySelector('.dropdown-menu');

// headerProfileImg에 사용자 프로필 이미지 삽입


$headerProfileImg.addEventListener('click', ()=>{
    if($dropdownMenu.style.display === 'block') 
        $dropdownMenu.style.display = 'none';
    else
        $dropdownMenu.style.display = 'block';
});

renderHeaderProfileImg(user_id, $headerProfileImg);

const $writeBtn = document.querySelector('.writeBox button');

$writeBtn.addEventListener('click', function() {
    window.location.href = '/addBoard'; // 홈 화면으로 이동
});



try
{
  const offset = 0;
  const response = await fetch(`http://localhost:3030/api/posts?offset=${offset}&limit=10`);
  if(response.ok)
  {
    const responseData = await response.json();
    const posts = responseData.data;
    console.log(posts);
    await renderPosts(posts);
  }
}catch(error){
  console.error('There was a problem with your fetch operation:', error);
}

// 작성자 정보를 추가하여 게시글 렌더링
async function renderPosts(posts) {
  for (const post of posts) {
      const response = await fetch(`http://localhost:3030/api/users/${post.writerId}`);
      const responseJson = await response.json();
      if(!response.ok)
      {
        throw new Error(responseJson.message);
      }

      const writer = responseJson.data;
      
      // 게시글 요소 생성
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      
      
      postElement.innerHTML = `
        <div data-id=${post.id}>
            <h3>${post.title}</h3>
            <div class="postInfo">
                <div>
                    <span>좋아요 ${post.like}</span>
                    <span>댓글 ${post.comment}</span>
                    <span>조회수 ${post.view}</span>
                </div>
                <div>
                    <span id="date">${utcToKst(post.date)}</span>
                </div>
            </div>
            <div class="postWriter">
                <img src="http://localhost:3030/userProfileImg/${writer.profileImgPath ?? 'default.png'}" alt="${writer ? writer.nickname : 'Unknown'}" />
                <span>${writer ? writer.nickname : 'Unknown'}</span>
            </div>
        </div>
      `;
  
      // 게시글 클릭 이벤트 추가
      postElement.addEventListener('click', () => {
        const postId = post.id; // data-id 속성에서 게시글 ID 가져오기
        window.location.href = `/detail?id=${postId}`; // 해당 ID를 포함한 URL로 이동
      });
  
      document.querySelector(".listBox").appendChild(postElement);
    }
  };

addEventInDropdown();
