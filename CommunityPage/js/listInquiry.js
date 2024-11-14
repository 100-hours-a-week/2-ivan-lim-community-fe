const $writeBtn = document.querySelector('.writeBox button');

$writeBtn.addEventListener('click', function() {
    window.location.href = '/addBoard'; // 홈 화면으로 이동
});


// let data;

// async function fetchData() {
//     try {
//         const response = await fetch('./data.json');
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         data = await response.json();
//     } catch (error) {
//         console.error('There was a problem with your fetch operation:', error);
//     }
// }

// // 데이터를 가져온 후 원하는 작업 수행
// fetchData().then(() => {
// });

// json-server API에서 데이터 가져오기
Promise.all([
    fetch('http://localhost:5001/users').then(response => response.json()),
    fetch('http://localhost:5001/posts').then(response => response.json())
  ])
    .then(([users, posts]) => renderPosts(users, posts))
    .catch(error => console.error('Error loading JSON:', error));
  
  // 작성자 정보를 추가하여 게시글 렌더링
  function renderPosts(users, posts) {
    posts = posts.slice().reverse(); // 원본 배열 유지
    console.log(posts);
  
    posts.forEach(post => {
      // 외래 키로 작성자 찾기
      const writer = users.find(user => user.id === post.writerId);
  
      // 게시글 요소 생성
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
        <div data-id=${post.id}>
            <h3>${post.title}</h3>
            <div class="postInfo">
                <div>
                    <span>좋아요 ${post.like}</span>
                    <span>댓글 ${post.comments.length}</span>
                    <span>조회수 ${post.view}</span>
                </div>
                <div>
                    <span id="date">${post.date}</span>
                </div>
            </div>
            <div class="postWriter">
                <img src="${writer && writer.profileImage ? writer.profileImage : '../style/춘식.png'}" alt="${writer ? writer.name : 'Unknown'}" />
                <span>${writer ? writer.name : 'Unknown'}</span>
            </div>
        </div>
      `;
  
      // 게시글 클릭 이벤트 추가
      postElement.addEventListener('click', () => {
        const postId = post.id; // data-id 속성에서 게시글 ID 가져오기
        window.location.href = `/detail?id=${postId}`; // 해당 ID를 포함한 URL로 이동
        
      });
  
      document.querySelector(".listBox").appendChild(postElement);
    });
  }
  

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


