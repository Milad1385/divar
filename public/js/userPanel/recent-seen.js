import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getLocalstorage,
  setToLocalstorage,
  showSwal,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const postsContainer = document.querySelector("#posts-container");
  const empty = document.querySelector(".empty");

  const recentSeens = getLocalstorage("recent-seens") || [];
  let posts = [];

  const getAndShowRecentPosts = (recents) => {
    postsContainer.innerHTML = "";
    if (recents.length) {
      recents.forEach((post) => {
        const date = calculateRelativeTimeDeffrence(post?.createdAt);
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
              <div class="post">
                  <div>
                  ${
                    post.pics.length
                      ? `<img src="${baseUrl}/${post.pics[0].path}" />`
                      : `<img src="/public/images/main/noPicture.PNG" />`
                  }
                  
                  <div>
                      <a class="title" href="/pages/post.html?id=${post._id}">${
            post.title
          }</a>
                      <p>${date} در ${post.city.name}، ${
            post.neighborhood.id !== 0 ? post.neighborhood.name : ""
          }</p>
                  </div>
                  </div>
                  <i onclick="sahrePost('${post._id}', '${
            post.title
          }')" class="bi bi-share"></i>
                  <i onclick="removeRecentSeen('${
                    post._id
                  }')" class="bi bi-trash"></i>
              </div> 
              `
        );
      });
    } else {
      empty.style.display = "flex";
    }
  };

  if (recentSeens.length) {
    for (const postID of recentSeens) {
      const res = await fetch(`${baseUrl}/v1/post/${postID}`);
      const result = await res.json();
      if (res.status !== 404) {
        posts.push(result.data?.post);
        getAndShowRecentPosts(posts);
      }
    }
  } else {
    empty.style.display = "flex";
  }

  window.removeRecentSeen = (postID) => {
    showSwal(
      "آیا از حذف بازدید اخیر اطمینان دارید ؟",
      "warning",
      ["خیر", "بله"],
      (result) => {
        if (result) {
          posts = posts.filter((post) => post._id !== postID);
          setToLocalstorage("recent-seens", posts);
          showSwal(
            "بازدید اخیر یا موفقیت حذف شد",
            "success",
            "خیلی هم عالی",
            () => {
              getAndShowRecentPosts(posts);
            }
          );
        }
      }
    );
  };

  window.sharePost = async (id, title) => {
    await navigator.share({ url: `/pages/post.html?id=${id}`, title });
  };

  loading.style.display = "none";
});
