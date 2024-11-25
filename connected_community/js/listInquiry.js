const $writeBtn = document.querySelector('.writeBox button');

$writeBtn.addEventListener('click', function() {
    window.location.href = '/addBoard'; // 홈 화면으로 이동
});

const offset = 0;
try
{
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
  posts = posts.slice().reverse(); // 원본 배열 유지

  for (const post of posts) {
      // 외래 키로 작성자 찾기인 줄 알았는데... 지금 이건 그냥 공통 컬럼으로 찾기인듯.
      const response = await fetch(`http://localhost:3030/api/users/${post.writerId}`);
      if(!response.ok)
        throw new Error('User not found');

      const responseJson = await response.json();
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
                    <span id="date">${post.date}</span>
                </div>
            </div>
            <div class="postWriter">
                <img src="${writer && writer.profileImage ? writer.profileImage : '../style/춘식.png'}" alt="${writer ? writer.nickname : 'Unknown'}" />
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

// const $titleElement = document.querySelector('.post h3');
// const maxLength = 26; // 최대 표시할 문자 수

// console.log($titleElement.textContent.length);
// console.log(data);

// if ($titleElement.textContent.length > maxLength) {
//     $titleElement.textContent = $titleElement.textContent.slice(0, maxLength) + '...';
// }

// // 날짜 포맷 함수
// function formatDate(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

// // 숫자 포맷 함수
// function formatNumber(value) {
//     if (value >= 100000) return `${Math.floor(value / 1000)}k`;
//     if (value >= 10000) return `${Math.floor(value / 1000)}k`;
//     if (value >= 1000) return `${Math.floor(value / 1000)}k`;
//     return value;
// }

// // 날짜 업데이트
// const postDate = new Date("2021-01-01T00:00:00");
// document.querySelector(".postInfo div span").textContent = formatDate(postDate);

// // document.querySelector(".postInfo span:nth-child(1)").textContent = `좋아요 ${formatNumber(likes)}`;
// // document.querySelector(".postInfo span:nth-child(2)").textContent = `댓글 ${formatNumber(comments)}`;
// // document.querySelector(".postInfo span:nth-child(3)").textContent = `조회수 ${formatNumber(views)}`;

// // 카드 클릭 시 이동
// document.querySelector('.post').addEventListener('click', function() {
//     // window.location.href = '/detail/{id}';
// });


// // 카드 클릭시 게시글 상세조회로 이동 -- 게시글 id 필요?
// // 게시글수, 댓글수, 조회수 -- 끌고 와서 formatNumber 적용.
// // 날짜 및 시간 표기 : yyyy-mm-dd hh:mm:ss -- 게시글 작성일 끌고오기.


const $headerProfileImg = document.querySelector('#headerProfileImg');
const $dropdownMenu = document.querySelector('.dropdown-menu');
$headerProfileImg.addEventListener('click', ()=>{
    if($dropdownMenu.style.display === 'block') 
        $dropdownMenu.style.display = 'none';
    else
        $dropdownMenu.style.display = 'block';
});

const $memInfoModi = document.querySelector('.dropdown-menu li:nth-child(1)');
const $passModi = document.querySelector('.dropdown-menu li:nth-child(2)');
const $logout = document.querySelector('.dropdown-menu li:nth-child(3)');

$memInfoModi.addEventListener('click', ()=>{
    location.href = '/memInfoModi';
});

$passModi.addEventListener('click', ()=>{
    location.href = '/passModi';
});

$logout.addEventListener('click', ()=>{
    location.href = '/logout';
});
