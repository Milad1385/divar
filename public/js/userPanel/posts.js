import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getToken,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const emptyElem = document.querySelector(".empty");
  const postsContainer = document.querySelector("#posts-container");

  loading.style.display = "none";

  const res = await fetch(`${baseUrl}/v1/user/posts`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();

  const getAndShowUserPosts = () => {
    postsContainer.innerHTML = "";

    if (result.data.posts.length) {
      result.data.posts.forEach((post) => {
        const date = calculateRelativeTimeDeffrence(post.createdAt);
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
          
          <a class="post" href="/pages/userPanel/posts/preview.html?id=${
            post._id
          }">
          <div class="post-info">
          ${
            post.pics.length
              ? `<img src="${baseUrl}/${post.pics[0].path}" />`
              : `<img src="/public/images/main/noPicture.PNG" />`
          }
          <div>
              <p class="title">${post.title}</p>
              <p class="price">${post.price.toLocaleString()} تومان</p>
              <p class="location">${date} در ${post.city.name}</p>
          </div>
          </div>
          <div class="post-status">
          <div>
              <p>وضعیت آگهی:</p>
              ${
                post.status === "published"
                  ? `<p class="publish">منتشر شده</p>`
                  : ""
              }
              ${
                post.status === "rejected" ? `<p class="reject">رد شده</p>` : ""
              }
              ${
                post.status === "pending"
                  ? `<p class="pending">در صف انتشار</p>`
                  : ""
              }
              
          </div>
          <button class="controll-btn">مدیریت اگهی</button>
          </div>
      </a>  
          `
        );
      });
    } else {
      emptyElem.style.display = "flex";
    }
  };

  getAndShowUserPosts();

  console.log(result);
});
