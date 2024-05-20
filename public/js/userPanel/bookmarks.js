import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getToken,
  showSwal,
  paginatedItems,
  getUrlParam,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const postsContainer = document.querySelector("#posts-container");
  const loading = document.querySelector("#loading-container");
  const paginationItems = document.querySelector(".pagination-items");
  const emptyContainer = document.querySelector(".empty");

  const token = await getToken();
  let posts = [];
  let page = getUrlParam("page") || 1;

  const generatePost = (post) => {
    const date = calculateRelativeTimeDeffrence(post.createdAt);
    postsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="post">
            <div>
                <div>
                <a class="title" href="/pages/post.html?id=${post._id}">${
        post.title
      }</a>
                <div>
                    <p>${post.price.toLocaleString("fa")} تومان</p>
                    <p>${date} در ${post.neighborhood.name}</p>
                </div>
                </div>
                ${
                  post.pics.length
                    ? `<img src="${baseUrl}/${post.pics[0].path}" />`
                    : `<img src="/public/images/main/noPicture.PNG" />`
                }
                
            </div>
            <div>
                <button onclick="sharePost('${post._id}', '${post.title}')">
                اشتراک گذاری
                <i class="bi bi-share"></i>
                </button>
                <button onclick="removeBookmark('${post._id}')">
                حذف نشان
                <i class="bi bi-trash"></i>
                </button>
            </div>
        </div> 
    `
    );
  };

  window.removeBookmark = (postID) => {
    showSwal(
      "آیا از حذف نشان اطمینان دارید ؟",
      "warning",
      ["خیر", "بله"],
      async (result) => {
        if (result) {
          console.log(postID);
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            posts = posts.filter((post) => post._id !== postID);
            if (posts.length) {
              postsContainer.innerHTML = "";
              posts.forEach((post) => generatePost(post));
            } else {
              postsContainer.innerHTML = "";
              emptyContainer.style.display = "flex";
            }
          }
        }
      }
    );
  };
  window.sharePost = async (id, title) => {
    await navigator.share({ url: `/pages/post.html?id=${id}`, title });
  };

  const res = await fetch(`${baseUrl}/v1/user/bookmarks?page=${page}&limit=4`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data } = await res.json();
  if (data.posts.length) {
    posts = data.posts;
    data.posts.forEach((post) => generatePost(post));
    paginatedItems(
      "/pages/userPanel/bookmarks.html",
      paginationItems,
      page,
      4,
      data.pagination.totalPosts
    );
  } else {
    emptyContainer.style.display = "flex";
  }

  loading.style.display = "none";
});
