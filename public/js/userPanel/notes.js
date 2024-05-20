import { baseUrl } from "../../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getToken,
  getUrlParam,
  paginatedItems,
  showSwal,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const emptyElem = document.querySelector(".empty");
  const postsContainer = document.querySelector("#posts-container");
  const paginationItems = document.querySelector(".pagination-items");
  let page = getUrlParam("page") || 1;

  const token = getToken();

  const getAndShowPosts = async () => {
    const res = await fetch(`${baseUrl}/v1/user/notes?page=${page}&limit=4`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await res.json();
    postsContainer.innerHTML = "";
    data.posts.forEach((post) => {
      const date = calculateRelativeTimeDeffrence(post.createdAt);
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
                      <p>${date} در  ${post.city.name} ، ${
          post.neighborhood.name
        }</p>
                      <p>${post.note.content}</p>
                      </div>
                  </div>
                  <i class="bi bi-trash" onclick=removeNote('${
                    post.note._id
                  }')></i>
          </div>
          `
      );
    });

    paginatedItems(
      "/pages/userPanel/notes.html",
      paginationItems,
      page,
      4,
      data.pagination.totalPosts
    );

    loading.style.display = "none";
  };

  getAndShowPosts();

  window.removeNote = async (noteID) => {
    showSwal(
      "آیا از حذف نشان اطمینان دارید ؟",
      "warning",
      ["خیر", "بله"],
      async (result) => {
        if (result) {
          const res = await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            showSwal("یادداشت با موفقیت حذف شد", "success", "اوکی", () => {
              getAndShowPosts();
            });
          }
        }
      }
    );
  };
});
