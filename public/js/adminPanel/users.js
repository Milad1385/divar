import { baseUrl } from "../../../utils/shared.js";
import { getToken, getUrlParam, paginatedItems } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const usersContainer = document.querySelector(".users-container");
  const paginationItems = document.querySelector(".pagination-items");
  let page = getUrlParam("page") || 1;
  const res = await fetch(`${baseUrl}/v1/users?page=${page}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const {
    data: { users, pagination },
  } = await res.json();

  console.log(pagination);

  const generateUsers = async () => {
    usersContainer.innerHTML = "";

    users.forEach((user) => {
      usersContainer.insertAdjacentHTML(
        "beforeend",
        `
            <tr>
                <td>${user.phone}</td>
                <td>${user.postsCount}</td>
                <td>${user.role === "ADMIN" ? "ادمین" : "کاربر عادی"}</td>
                <td><button class="edit-btn">ویرایش</button></td>
                <td><button class="delete-btn">بن</button></td>
            </tr>
        `
      );
    });
  };

  paginatedItems(
    "/pages/adminPanel/users.html",
    paginationItems,
    page,
    10,
    pagination.totalUsers
  );

  generateUsers();
});
