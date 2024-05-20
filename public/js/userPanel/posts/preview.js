import { baseUrl } from "../../../../utils/shared.js";
import {
  calculateRelativeTimeDeffrence,
  getToken,
  getUrlParam,
} from "../../../../utils/utils.js";

window.addEventListener("load", async () => {
  const postTitle = document.querySelector("#post-title");
  const postLocation = document.querySelector("#post-location");
  const postInfoesList = document.querySelector("#post-infoes-list");
  const postDescription = document.querySelector("#post-description");
  const mainSlider = document.querySelector("#main-slider-wrapper");
  const secendSlider = document.querySelector("#secend-slider-wrapper");
  const loading = document.querySelector("#loading-container");
  const postID = getUrlParam("id");
  if (!postID) {
    location.href = `/pages/posts.html`;
    return false;
  }

  const res = await fetch(`${baseUrl}/v1/post/${postID}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const {
    data: { post },
  } = await res.json();

  console.log(post);

  const date = calculateRelativeTimeDeffrence(post.createdAt);

  postTitle.innerHTML = post.title;
  postDescription.innerHTML = post.description;
  postLocation.innerHTML = `${date} در ${post.city.name} ، ${post.neighborhood.name}`;

  if (post.status === "published") {
    postInfoesList.insertAdjacentHTML(
      "beforeend",
      `
      <li class="post__info-item">
        <span class="post__info-value">لینک آگهی</span>
        <a href="/pages/post.html?id=${post._id}" class="post__info-value">${post.title} تومان</a>
      </li>
    `
    );
  }

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
          <span class="post__info-value">${
            typeof field.data === "boolean"
              ? field.data
                ? "دارد"
                : "ندارد"
              : field.data
          }</span>
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
              <img src="${baseUrl}/${pic.path}" class="main-image" />
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

  // handle map

  const map = L.map("map").setView([post.map.x, post.map.y], 13);

  let firstIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  let marker = L.marker([post.map.x, post.map.y], { icon: firstIcon }).addTo(
    map
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  loading.style.display = "none";
});
