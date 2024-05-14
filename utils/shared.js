import { getMe, getToken, getUrlParam, isLogin } from "./utils.js";

const baseUrl = "https://divarapi.liara.run";

const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();

  return cities;
};

const getAndShowSocialIcons = async () => {
  const socialsContainer = document.querySelector("#footer__social-media");

  try {
    const res = await fetch(`${baseUrl}/v1/social`);
    const { data } = await res.json();
    socialsContainer.innerHTML = "";

    data.socials.forEach((social) => {
      socialsContainer.insertAdjacentHTML(
        "beforeend",
        `
              <a href="${social.link}" class="socials__link">
                  <img src="${baseUrl + "/" + social.icon.path}"/>
              </a>
          `
      );
    });
  } catch (err) {
    return err;
  }
};

const getAllPosts = async (city) => {
  const categoryId = getUrlParam("category");
  const searchValue = getUrlParam("q");
  let url = `${baseUrl}/v1/post/?city=${city}`;

  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }

  if (searchValue) {
    url += `&search=${searchValue}`;
  }
  const res = await fetch(`${url}`);
  const posts = await res.json();

  return posts;
};

const getAllCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);
  const response = await res.json();

  return response.data.categories;
};

const getAllLocations = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const response = await res.json();

  return response.data;
};

const getPostDetails = async () => {
  const postId = getUrlParam("id");
  let headers = {};
  const token = getToken();

  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const res = await fetch(`${baseUrl}/v1/post/${postId}`, {
    headers,
  });
  const result = await res.json();

  return result.data.post;
};

const showPanelLinks = async () => {
  const dropDown = document.querySelector(".header_dropdown_menu");
  const userLogin = await isLogin();

  dropDown.innerHTML = "";

  if (dropDown) {
    if (userLogin) {
      getMe().then((user) => {
        dropDown.insertAdjacentHTML(
          "beforeend",
          `
              <li class="header__left-dropdown-item header_dropdown-item_account">
                <a
                  href="/pages/userPanel/posts.html"
                  class="header__left-dropdown-link login_dropdown_link"
                >
                  <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                  <div>
                    <span>کاربر دیوار </span>
                    <p>تلفن ${user.phone}</p>
                  </div>
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/verify.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  تایید هویت
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/bookmarks.html">
                  <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                  نشان ها
                </a>
              </li>
              <li class="header__left-dropdown-item">
                <a class="header__left-dropdown-link" href="/pages/userPanel/notes.html">
                  <i class="header__left-dropdown-icon bi bi-journal"></i>
                  یادداشت ها
                </a>
              </li>
              <li class="header__left-dropdown-item logout-link" id="login_btn">
                <p class="header__left-dropdown-link" href="#">
                  <i class="header__left-dropdown-icon bi bi-shop"></i>
                  خروج
                </p>
              </li>
          `
        );
      });
    } else {
      dropDown.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__left-dropdown-item">
            <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
              <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
              ورود
            </span>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-bookmark"></i>
              نشان ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-journal"></i>
              یادداشت ها
            </div>
          </li>
          <li class="header__left-dropdown-item">
            <div class="header__left-dropdown-link" href="#">
              <i class="header__left-dropdown-icon bi bi-clock-history"></i>
              بازدید های اخیر
            </div>
          </li>
        `
      );

      dropDown.addEventListener("click", () => {
        showModal("login-modal", "login-modal--active");
      });
    }
  }
};

const getAllArticles = async () => {
  const res = await fetch(`${baseUrl}/v1/support/category-articles`);
  const result = await res.json();
  console.log(result);

  return result.data.categories;
};

const getSingleArticle = async (id) => {
  const res = await fetch(`${baseUrl}/v1/support/articles/${id}`);
  const result = await res.json();
  return result.data.article;
};

const getSameArticles = async (categoryID) => {
  const res = await fetch(
    `${baseUrl}/v1/support/categories/${categoryID}/articles`
  );
  const result = await res.json();

  return result.data.articles;
};

const getSearchResults = async (key) => {
  const res = await fetch(`${baseUrl}/v1/support/articles/search?s=${key}`);
  const result = await res.json();

  console.log(result);

  return result.data.articles;
};

export {
  baseUrl,
  getAllCities,
  getAndShowSocialIcons,
  getAllPosts,
  getAllCategories,
  getAllLocations,
  getPostDetails,
  showPanelLinks,
  getAllArticles,
  getSingleArticle,
  getSameArticles,
  getSearchResults,
};
