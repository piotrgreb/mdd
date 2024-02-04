// Funkcja do pobierania danych z API
async function fetchData(url) {
  showLoader();
  const response = await fetch(url);
  return response.json();
}

// Funkcja do wyświetlania postów z komentarzami
function getPostsAndComments(posts, comments) {

  // Mapowanie komentarzy do odpowiednich postów
  const postCommentsMap = comments.reduce((map, comment) => {
    const { postId } = comment;
    if (!map[postId]) {
      map[postId] = [];
    }
    map[postId].push(comment);
    return map;
  }, {});

  // Wyświetlanie postów z komentarzami
  posts.map((post, index) => {
    const postElement = document.createElement("div");
    postElement.innerHTML = `
      <h2>${index + 1 + "."} ${post?.title}</h2>
      <p>${post?.body}</p>
      <h4>Komentarze:</h4>
    `;

    // Dodawanie komentarzy do posta
    if (postCommentsMap[post.id]) {
      const commentsList = document.createElement("ul");
      postCommentsMap[post.id].map((comment) => {
        commentsList.innerHTML += `
        <li>
        <h4>${comment?.name}</h4>
        <p>${comment?.body}</p>
        </li>`;
      });
      postElement.appendChild(commentsList);
    } else {
      const commentInfo = document.createElement("p");
      commentInfo.innerHTML = `Brak komentarzy`;
      postElement.appendChild(commentInfo);
    }
    document.body.appendChild(postElement);
  });
}

// Loader
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Pobieranie danych
Promise.all([
  fetchData("https://jsonplaceholder.typicode.com/posts"),
  fetchData("https://jsonplaceholder.typicode.com/comments"),
])
  .then(([posts, comments]) => {
    getPostsAndComments(posts, comments);
    hideLoader();
  })
  .catch((error) => {
    console.error("Wystąpił błąd:", error);
    hideLoader();
  });
