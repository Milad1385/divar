import { baseUrl, getAllPosts } from "../../../utils/shared.js";
import { getMe, getToken } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const postsContainer = document.querySelector(".posts-container");
  const usersContainer = document.querySelector(".users-container");
  const articlesCountElem = document.querySelector(".articles-count");
  const postsCountElem = document.querySelector(".posts-count");
  const usersCountElem = document.querySelector(".users-count");

  const res = await fetch(`${baseUrl}/v1/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const results = await res.json();

  const { posts, users, usersCount, postsCount, articlesCount } = results.data;
  console.log(results.data);

  articlesCountElem.innerHTML = articlesCount.toLocaleString("fa");
  postsCountElem.innerHTML = postsCount.toLocaleString("fa");
  usersCountElem.innerHTML = usersCount.toLocaleString("fa");

  const generatePosts = async () => {
    postsContainer.innerHTML = "";
    posts.forEach((post) => {
      postsContainer.insertAdjacentHTML(
        "beforeend",
        `
            <tr>
                <td>${post.title}</td>
                <td>${post.creator.phone}</td>
                <td>${post.category.title}</td>
            </tr>
        `
      );
    });
  };

  const generateUser = async () => {
    usersContainer.innerHTML = "";
    users.forEach((user) => {
      usersContainer.insertAdjacentHTML(
        "beforeend",
        `
            <tr>
                <td>${user.phone}</td>
                <td>${user.verified ? "تایید شده" : "تایید نشده"}</td>
                <td>${user.postsCount}</td>
            </tr>
        `
      );
    });
  };

  generatePosts();
  generateUser();
});
