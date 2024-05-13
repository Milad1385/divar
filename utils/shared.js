import { getToken, getUrlParam } from "./utils.js";

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

export {
  baseUrl,
  getAllCities,
  getAndShowSocialIcons,
  getAllPosts,
  getAllCategories,
  getAllLocations,
  getPostDetails,
};
