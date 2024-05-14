import { baseUrl, getPostDetails } from "../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getToken,
  isLogin,
  showModal,
} from "../../utils/utils.js";

window.addEventListener("load", async () => {
  const loadingElem = document.querySelector("#loading-container");
  const description = document.querySelector("#post-description");
  const title = document.querySelector("#post-title");
  const postLocation = document.querySelector("#post-location");
  const breadcrumb = document.querySelector("#breadcrumb");
  const mainSlider = document.querySelector("#main-slider-wrapper");
  const secendSlider = document.querySelector("#secend-slider-wrapper");
  const postPreview = document.querySelector("#post-preview");
  const postInfoesList = document.querySelector("#post-infoes-list");
  const shareIcon = document.querySelector("#share-icon");
  const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");
  const noteTextarea = document.querySelector("#note-textarea");
  const noteTrashIcon = document.querySelector("#note-trash-icon");
  const bookmarkIconBtn = document.querySelector("#bookmark-icon-btn");
  const bookmarkIcon = bookmarkIconBtn.querySelector(".bi");
  const isUserLogin = await isLogin();
  const token = getToken();

  let noteID = null;
  let bookmarkStatus = false;

  getPostDetails().then((post) => {
    const date = calculateRelativeTimeDeffrence(post.createdAt);
    loadingElem.style.display = "none";
    description.innerHTML = post.description;
    title.innerHTML = post.title;
    postLocation.innerHTML = `${date} در ${post.city.name} ${
      post.neighborhood.name ? `، ${post.neighborhood.name}` : ""
    }`;

    breadcrumb.insertAdjacentHTML(
      "beforeend",
      `
        <li class="main__breadcrumb-item">
            ${post.breadcrumbs.category.title}
            <a class="main__breadcrumb-link" href="#">
                <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </a>
        </li>
        <li class="main__breadcrumb-item">
            ${post.breadcrumbs.subCategory.title}
            <a class="main__breadcrumb-link" href="#">
                <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
            </a>
        </li>
        <li class="main__breadcrumb-item">
            ${post.breadcrumbs.subSubCategory.title}
        </li>
    `
    );

    postInfoesList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="post__info-item">
        <span class="post__info-value">قیمت</span>
        <span class="post__info-value">${post.price.toLocaleString(
          "fa"
        )} تومان</span>
      </li>
    `
    );

    post.dynamicFields.forEach((field) => {
      postInfoesList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="post__info-item">
          <span class="post__info-value">${field.name}</span>
          <span class="post__info-value">${field.data}</span>
        </li>
      `
      );
    });

    if (post.pics.length) {
      post.pics.forEach((pic, index) => {
        mainSlider.insertAdjacentHTML(
          "beforeend",
          `
            <div class="swiper-slide">
                <img src="${baseUrl}/${pic.path}" />
            </div>
        `
        );
      });

      post.pics.forEach((pic, index) => {
        secendSlider.insertAdjacentHTML(
          "beforeend",
          `
            <div class="swiper-slide">
                <img src="${baseUrl}/${pic.path}" class="t-image" />
            </div>
        `
        );
      });
    } else {
      postPreview.style.display = "none";
      noteTextarea.parentElement.style.marginTop = "0px";
    }

    if (isUserLogin) {
      // bookmark
      if (post.bookmarked) {
        bookmarkStatus = true;
        bookmarkIcon.style.color = "red";
      } else {
        bookmarkStatus = false;
        bookmarkIcon.style.color = "black";
      }

      bookmarkIconBtn.addEventListener("click", async (e) => {
        if (bookmarkStatus) {
          const res = await fetch(`${baseUrl}/v1/bookmark/${post._id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            bookmarkIcon.style.color = "black";
            bookmarkStatus = false;
          }
        } else {
          const res = await fetch(`${baseUrl}/v1/bookmark/${post._id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (res.status === 201) {
            bookmarkIcon.style.color = "red";
            bookmarkStatus = true;
          }
        }
      });

      // note
      if (post.note) {
        noteTextarea.value = post.note.content;
        noteID = post.note._id;
      }

      noteTextarea.addEventListener("keyup", (e) => {
        if (e.target.value.trim()) {
          noteTrashIcon.style.display = "block";
        } else {
          noteTrashIcon.style.display = "none";
        }
      });

      noteTextarea.addEventListener("blur", async (e) => {
        if (noteID) {
          const res = await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: e.target.value }),
          });
        } else {
          const res = await fetch(`${baseUrl}/v1/note`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ postId: post._id, content: e.target.value }),
          });
        }
      });

      noteTrashIcon.addEventListener("click", () => {
        noteTextarea.value = "";
        noteTrashIcon.style.display = "none";
      });
    } else {
      // codes
      noteTextarea.addEventListener("focus", (e) => {
        showModal("login-modal", "login-modal--active");
      });
    }
  });
  shareIcon?.addEventListener("click", async (e) => {
    await navigator.share(location.href);
  });

  postFeedbackIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      postFeedbackIcons.forEach((icon) => icon.classList.remove("active"));
      icon.classList.add("active");
    });
  });
});
