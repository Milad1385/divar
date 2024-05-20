import { baseUrl } from "./shared.js";

const setToLocalstorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalstorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const addToUrlParam = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;
  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();
};

const getUrlParam = (key) => {
  const searchParam = new URLSearchParams(window.location.search).get(key);
  return searchParam;
};

const deleteUrlParam = (param) => {
  const url = new URL(location.href);
  url.searchParams.delete(param);
  history.replaceState(null, null, url);
  location.reload();
};

const calculateRelativeTimeDeffrence = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);
  const diffrenceTime = currentTime - createdTime;

  const hour = Math.floor(diffrenceTime / (60 * 60 * 1000));

  if (hour <= 24 && hour >= 1) {
    return `${hour.toLocaleString("fa")} ساعت پیش`;
  } else if (hour <= 1) {
    return `لحظاتی پیش`;
  } else if (hour > 24) {
    return `${Math.floor(hour / 24).toLocaleString("fa")} روز پیش  `;
  }
};

const showModal = (elem, className) => {
  const element = document.querySelector(`.${elem}`);
  element.classList.add(className);
};

const hideModal = (elem, className) => {
  const element = document.querySelector(`.${elem}`);
  element.classList.remove(className);
};

const getAndShowUserSelectCities = () => {
  const cities = getLocalstorage("cities");
  const headerCityTitle = document.querySelector("#header-city-title");
  if (headerCityTitle) {
    if (!cities) {
      setToLocalstorage("cities", [{ name: "تهران", id: "301" }]);
      headerCityTitle.innerHTML = "تهران";
    } else {
      if (cities.length === 1) {
        headerCityTitle.innerHTML = `${cities[0].name}`;
      } else {
        headerCityTitle.innerHTML = `شهر ${cities.length}`;
      }
    }
  }
};

const showSwal = (title, icon, buttons, callBack) => {
  swal({
    title,
    icon,
    buttons,
  }).then((res) => callBack(res));
};

const getToken = () => {
  const token = getLocalstorage("token");
  return token;
};

const isLogin = async () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.status === 200 ? true : false;
};

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  const res = await fetch(`${baseUrl}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data.user;
};

const paginatedItems = (
  href,
  paginationContainer,
  currentPage,
  perPage,
  totalItems
) => {
  paginationContainer.innerHTML = "";
  let paginatedNumber = Math.ceil(totalItems / perPage);
  for (let i = 1; i < paginatedNumber + 1; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
      <li class="${i === Number(currentPage) ? "active" : ""} pagination-item">
        <a href="${href}?page=${i}">${i.toLocaleString("fa")}</a>
      </li>
    `
    );
  }
};

export {
  setToLocalstorage,
  getLocalstorage,
  addToUrlParam,
  getUrlParam,
  calculateRelativeTimeDeffrence,
  deleteUrlParam,
  showModal,
  hideModal,
  getAndShowUserSelectCities,
  isLogin,
  showSwal,
  getToken,
  getMe,
  paginatedItems,
};
