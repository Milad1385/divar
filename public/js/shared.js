import {
  logout,
  requestNewOtpCode,
  submittingHandler,
  verifyOtp,
} from "../../utils/auth.js";
import {
  getAllCategories,
  getAllLocations,
  getAndShowSocialIcons,
  showPanelLinks,
} from "../../utils/shared.js";
import {
  addToUrlParam,
  deleteUrlParam,
  getAndShowUserSelectCities,
  getLocalstorage,
  getUrlParam,
  hideModal,
  isLogin,
  setToLocalstorage,
  showModal,
} from "../../utils/utils.js";

window.addEventListener("load", async () => {
  let cities = [];
  getAndShowUserSelectCities();
  getAndShowSocialIcons();
  showPanelLinks();
  getAllLocations().then((data) => {
    cities = data;
  });

  const isUserLogin = await isLogin();
  // city element
  const searchElem = document.querySelector("#global_search_input");
  const overlayElem = document.querySelector("#overlay-elem");
  const cityModalOverlay = document.querySelector(".city-modal__overlay");
  const cityModalListElem = document.querySelector("#city_modal_list");
  const cityModalAcceptBtn = document.querySelector(".city-modal__accept");
  const cityModalError = document.querySelector("#city_modal_error");
  const deleteAllCitiesBtn = document.querySelector("#delete-all-cities");
  const cityModalSearchInput = document.querySelector(
    "#city-modal-search-input"
  );
  const mostSearchDropdownListElem = document.querySelector(
    ".header__searchbar-dropdown-list"
  );
  const cityModalCitiesContainer = document.querySelector(
    ".city-modal__cities"
  );
  const deleteSearchIcon = document.querySelector("#remove-search-value-icon");
  const cityModalButton = document.querySelector(".header__city");
  const cityModalClose = document.querySelector(".city-modal__close");
  const cityModalAccept = document.querySelector(".city-modal__accept");
  // header category
  const headerCategoryBtn = document.querySelector(".header__category-btn");
  const headerCategoryMenuOverlay = document.querySelector(
    ".header__category-menu"
  );
  const categoriesList = document.querySelector("#categories-list");
  const allCategoriesPostsBtn = document.querySelector("#all-categories-posts");
  const categoryResults = document.querySelector("#category-results");
  // login modal elem
  const loginModalHeaderBtn = document.querySelector(
    ".login-modal__header-btn"
  );
  const loginModalOverlay = document.querySelector(".login_modal_overlay");
  const submitPhoneNumberBtn = document.querySelector(
    ".submit_phone_number_btn"
  );

  const createPostBtn = document.querySelector(".create_post_btn");

  const sendOtpBtn = document.querySelector(".login_btn");
  const reSendOtpBtn = document.querySelector(".req_new_code_btn");

  // utils funcs
  const searchValue = getUrlParam("q");
  const mostSearchResult = ["کیف", "کفش", "سواری ", "لپ تاپ", "سامسونگ"];
  let selectedCities = getLocalstorage("cities");
  searchElem ? (searchElem.value = searchValue) : null;
  // start category mega menu

  getAllCategories().then((categories) => {
    categoriesList ? (categoriesList.innerHTML = "") : null;
    categories.forEach((category) => {
      categoriesList?.insertAdjacentHTML(
        "beforeend",
        `
        <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${category._id}')">
          <div class="header__category-menu-link">
            <div class="header__category-menu-link-right">
              <i class="header__category-menu-icon bi bi-house"></i>
              ${category.title}
            </div>
            <div class="header__category-menu-link-left">
              <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
            </div>
          </div>
        </li>
      `
      );
    });

    window.showActiveCategorySubs = (categoryId) => {
      const category = categories.find(
        (category) => category._id === categoryId
      );

      categoryResults ? (categoryResults.innerHTML = "") : null;
      category.subCategories.forEach((subCategory) => {
        categoryResults?.insertAdjacentHTML(
          "beforeend",
          `
          <div>
            <ul class="header__category-dropdown-list">
              <div class="header__category-dropdown-title" onclick="categoryClickHandler('${
                subCategory._id
              }')">${subCategory.title}</div>
              ${subCategory.subCategories
                .map(
                  (subSubCategory) => `
                  <li class="header__category-dropdown-item">
                    <div onclick="categoryClickHandler('${subSubCategory._id}')" class="header__category-dropdown-link">${subSubCategory.title}</div>
                  </li>
                `
                )
                .join("")}
            </ul>
          </div>
        `
        );
      });
    };

    window.categoryClickHandler = (categoryId) => {
      addToUrlParam("category", categoryId);
    };

    showActiveCategorySubs(categories[0]._id);
  });

  // finish category mega menu

  if (searchValue) {
    deleteSearchIcon.style.display = "block";
  }

  deleteSearchIcon?.addEventListener("click", () => {
    deleteUrlParam("q");
  });

  searchElem?.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      if (e.target.value.trim().length) {
        addToUrlParam("q", e.target.value);
      }
    }
  });

  searchElem?.addEventListener("click", (e) => {
    console.log("click");
    showModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active"
    );
  });

  overlayElem?.addEventListener("click", () => {
    hideModal(
      "header__searchbar-dropdown",
      "header__searchbar-dropdown--active"
    );
  });

  mostSearchResult.forEach((most) => {
    mostSearchDropdownListElem?.insertAdjacentHTML(
      `beforeend`,
      `
      <li>
        <a href="#" class="header__searchbar-dropdown-link" onclick="mostSearchClickHandler('${most}')">${most}</a>
      </li>
    `
    );
  });

  window.mostSearchClickHandler = (value) => {
    addToUrlParam("q", value.trim());
  };

  // city modal functions

  cityModalButton?.addEventListener("click", (e) => {
    showModal("city-modal", "city-modal--active");
  });

  const addCityToModal = (citiesItem, provinceName, provinceId) => {
    const citySelected = document.querySelector("#city-selected");
    const isExistProvince = citiesItem?.some((city) => city?.provinceId);
    let provinces = null;
    let provincesName = [];

    if (!provinceName) {
      let mainCities = citiesItem.filter((city) => !city?.provinceId);
      citySelected ? (citySelected.innerHTML = "") : null;
      mainCities.forEach((city) => {
        citySelected?.insertAdjacentHTML(
          "beforeend",
          `
            <div class="city-modal__selected-item">
              <span class="city-modal__selected-text">${city.name}</span>
              <button class="city-modal__selected-btn" onclick="deleteSelectedCityById('${city.id}')">
                <i class="city-modal__selected-icon bi bi-x"></i>
              </button>
            </div>
          `
        );
      });
    } else {
      citySelected.insertAdjacentHTML(
        "beforeend",
        `
            <div class="city-modal__selected-item" id="all-city-${provinceId}">
              <span class="city-modal__selected-text">${provinceName}</span>
              <button class="city-modal__selected-btn">
                <i class="city-modal__selected-icon bi bi-x" onclick="deleteProvinceHandler('${provinceId}' , event)"></i>
              </button>
            </div>
          `
      );
    }

    getAllLocations().then((data) => {
      if (isExistProvince) {
        let mainCities = citiesItem
          .filter((city) => city?.provinceId)
          .map((city) => city.provinceId);
        provinces = new Set(mainCities);

        for (const provinceItem of provinces) {
          let findedProvinces = data.provinces.find(
            (province) => province.id === +provinceItem
          );

          provincesName.push(findedProvinces);
        }

        provincesName.forEach((province) => {
          citySelected.insertAdjacentHTML(
            "beforeend",
            `
          <div class="city-modal__selected-item" id="all-${province.id}">
            <span class="city-modal__selected-text">تمام شهر های ${province.name}</span>
            <button class="city-modal__selected-btn">
              <i class="city-modal__selected-icon bi bi-x" onclick="deleteProvinceHandler('${province.id}' , event)"></i>
            </button>
          </div>
        `
          );
        });
      }
    });
  };

  window.deleteProvinceHandler = (provinceId, event) => {
    // unactivate provinnce when deleted
    const provinceItem = document?.querySelector(`#province-${provinceId}`);
    event.target.parentElement.parentElement?.remove();
    const checkboxShapeProvince = provinceItem?.querySelector("div");
    checkboxShapeProvince.classList.remove("active");
    // select all related city to province for unactivate them
    const allCitiesRelatedToProvince = document.querySelectorAll(
      `.province-${provinceId}`
    );

    allCitiesRelatedToProvince.forEach((city) => {
      const checkbox = city.querySelector("input");
      const checkboxShape = city.querySelector("div");

      checkboxShape.classList.remove("active");
      checkbox.checked = false;
    });
    selectedCities = selectedCities.filter(
      (city) => city?.provinceId !== +provinceId
    );

    isShowModalAcceptBtn(selectedCities);
  };

  const generateCities = (data) => {
    cityModalListElem ? (cityModalListElem.innerHTML = "") : null;
    cityModalCitiesContainer?.scrollTo(0, 0);
    data.provinces?.forEach((province) => {
      cityModalListElem?.insertAdjacentHTML(
        "beforeend",
        `
        <li
          class="city-modal__cities-item province-item"
          data-province-id="${province.id}"
        > 
          <span>${province.name}</span>
          <i class="city-modal__cities-icon bi bi-chevron-left"></i>
        </li>
      `
      );
    });

    const provincesItem = document.querySelectorAll(".province-item");
    provincesItem.forEach((provinceItem) => {
      provinceItem.addEventListener("click", (e) => {
        const provinceId = e.target.dataset.provinceId;
        const provinceName = e.target.innerText;

        generateCitiesRelatedToProvice(provinceId, provinceName, data);
      });
    });
  };

  generateCities(cities);

  addCityToModal(selectedCities);

  const generateCitiesRelatedToProvice = (provinceId, provinceName, data) => {
    const mainCities = data.cities.filter(
      (city) => city.province_id === +provinceId
    );
    cityModalListElem.innerHTML = "";
    cityModalListElem.insertAdjacentHTML(
      "beforeend",
      `
        <li id="city_modal_all_province" class="city_modal_all_province">
          <span>همه شهر ها</span>
          <i class="bi bi-arrow-right-short"></i>
        </li>
        <li class="city-modal__cities-item pro-${provinceId} select-all-city city-item" id='province-${provinceId}'>
          <span>همه شهر های ${provinceName} </span>
          <div id="checkboxShape"></div>
          <input type="checkbox" onchange="selectAllCitiesOfProvince('${provinceId}')" />
        </li>
    `
    );
    mainCities.forEach((city) => {
      const isSelect = selectedCities.some(
        (selectedCity) => +selectedCity.id === +city.id
      );
      cityModalListElem.insertAdjacentHTML(
        "beforeend",
        `
        <li class="city-modal__cities-item city-item province-${provinceId}" id="city-${
          city.id
        }">
          <span>${city.name}</span>
          <div id="checkboxShape" class="${isSelect ? "active" : ""}"></div>
          <input id="city-item-checkbox" type="checkbox" checked=${isSelect} onchange="addCitySelection('${
          city.id
        }')"  />
        </li>
      `
      );
    });

    const backToAllCities = document.querySelector(".city_modal_all_province");
    backToAllCities.addEventListener("click", () => {
      generateCities(data);
    });
  };

  window.selectAllCitiesOfProvince = (provinceId) => {
    const provinceItem = document.querySelector(`.pro-${provinceId}`);
    const allProvinceCity = document.querySelectorAll(
      `.province-${provinceId}`
    );

    const provinceName = provinceItem.querySelector("span").innerHTML;
    const checkbox = provinceItem.querySelector("input");
    const checkboxShape = provinceItem.querySelector("div");
    checkboxShape.classList.add("active");

    const allCities = cities.cities.filter(
      (city) => city.province_id === +provinceId
    );

    allCities.forEach((city) => {
      selectedCities.push({
        id: city.id,
        name: city.name,
        provinceId: city.province_id,
      });
    });

    checkbox.checked = !checkbox.checked;
    isShowModalAcceptBtn(selectedCities);

    if (checkbox.checked) {
      checkboxShape.classList.add("active");
      checkbox.checked = false;
      allProvinceCity.forEach((city) => {
        const checkboxShape = city.querySelector("div");
        const checkbox = city.querySelector("input");
        checkboxShape.classList.add("active");
        checkbox.checked = true;
      });

      addCityToModal(null, provinceName, +provinceId);
    } else {
      checkbox.checked = true;
      checkboxShape.classList.remove("active");
      allProvinceCity.forEach((city) => {
        const checkboxShape = city.querySelector("div");
        const checkbox = city.querySelector("input");
        checkboxShape.classList.remove("active");
        checkbox.checked = false;
      });

      document.querySelector(`#all-city-${provinceId}`)?.remove();

      selectedCities = selectedCities.filter(
        (city) => city?.provinceId !== +provinceId
      );

      document.querySelector(`#all-${provinceId}`)?.remove();
    }
  };

  window.addCitySelection = (cityId) => {
    const cityInputItem = document.querySelector(`#city-${cityId}`);
    const cityName = cityInputItem.querySelector("span").innerHTML;
    const checkbox = cityInputItem.querySelector("input");
    const checkboxShape = cityInputItem.querySelector("div");

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
      checkboxShape.classList.add("active");
      checkbox.checked = false;
      updateSelectedCity(cityId, cityName);
    } else {
      checkbox.checked = true;
      checkboxShape.classList.remove("active");
      selectedCities = selectedCities.filter((city) => city.name !== cityName);
      addCityToModal(selectedCities);
      isShowModalAcceptBtn(selectedCities);
    }
  };

  const updateSelectedCity = (cityId, cityName) => {
    const isExist = selectedCities.some((city) => city.name === cityName);
    if (!isExist) {
      selectedCities.push({ id: cityId, name: cityName });
      addCityToModal(selectedCities);
      isShowModalAcceptBtn(selectedCities);
    }
  };

  const isShowModalAcceptBtn = (cities) => {
    if (cities.length) {
      cityModalAcceptBtn.classList.replace(
        "city-modal__accept",
        "city-modal__accept--active"
      );
      cityModalError.style.display = "none";
      deleteAllCitiesBtn.style.display = "block";
    } else {
      cityModalAcceptBtn.classList.replace(
        "city-modal__accept--active",
        "city-modal__accept"
      );
      cityModalError.style.display = "block";
      deleteAllCitiesBtn.style.display = "none";
    }
  };

  window.deleteSelectedCityById = (cityId) => {
    const cityItemElem = document.querySelector(`#city-${cityId}`);
    if (cityItemElem) {
      const checkboxShape = cityItemElem.querySelector("div");
      const checkbox = cityItemElem.querySelector("input");

      checkbox.checked = false;
      checkboxShape.classList.remove("active");
    }

    selectedCities = selectedCities.filter(
      (selectedCity) => selectedCity.id !== cityId
    );

    addCityToModal(selectedCities);
    isShowModalAcceptBtn(selectedCities);
  };

  deleteAllCitiesBtn?.addEventListener("click", (e) => {
    const cityItemElements = document.querySelectorAll(".city-item");
    cityItemElements.forEach((cityItemElem) => {
      const checkboxShape = cityItemElem.querySelector("div");
      const checkbox = cityItemElem.querySelector("input");
      checkboxShape.classList.remove("active");
      checkbox.checked = false;
    });
    selectedCities = [];
    addCityToModal(selectedCities);
    isShowModalAcceptBtn(selectedCities);
  });

  cityModalClose?.addEventListener("click", (e) => {
    hideModal("city-modal", "city-modal--active");
    cityModalListElem.innerHTML = "";
    generateCities(cities);
    selectedCities = getLocalstorage("cities");
    addCityToModal(selectedCities);
  });

  cityModalAccept?.addEventListener("click", (e) => {
    hideModal("city-modal", "city-modal--active");
    setToLocalstorage("cities", selectedCities);
    getAndShowUserSelectCities();
    generateCities(cities);
    let citiesId = selectedCities.map((city) => city.id).join("|");
    addToUrlParam("cities", citiesId);
  });

  cityModalOverlay?.addEventListener("click", () => {
    hideModal("city-modal", "city-modal--active");
    cityModalListElem.innerHTML = "";
    generateCities(cities);
    selectedCities = getLocalstorage("cities");
    addCityToModal(selectedCities);
  });

  cityModalSearchInput?.addEventListener("keyup", (e) => {
    e.preventDefault();
    const searchedCities = cities.cities.filter((city) =>
      city.name.includes(e.target.value)
    );
    if (searchedCities.length && e.target.value.trim()) {
      cityModalListElem.innerHTML = "";
      searchedCities.forEach((city) => {
        const isSelect = selectedCities.some(
          (selectedCity) => +selectedCity.id === +city.id
        );
        cityModalListElem.insertAdjacentHTML(
          "beforeend",
          `
          <li class="city-modal__cities-item city-item" id="city-${city.id}">
            <span>${city.name}</span>
            <div id="checkboxShape" class="${isSelect ? "active" : ""}"></div>
            <input id="city-item-checkbox" type="checkbox" checked=${isSelect} onchange="addCitySelection('${
            city.id
          }')"  />
          </li>

        `
        );
      });
    } else {
      cityModalListElem.innerHTML = "";
      generateCities(cities);
    }
  });

  // finish city modal funcs

  // start category modal funcs

  headerCategoryBtn?.addEventListener("click", () => {
    showModal("header__category-menu", "header__category-menu--active");
  });

  headerCategoryMenuOverlay?.addEventListener("click", () => {
    hideModal("header__category-menu", "header__category-menu--active");
  });

  allCategoriesPostsBtn?.addEventListener("click", () => {
    deleteUrlParam("category");
  });

  // finish category modal funcs

  // start login modal

  loginModalHeaderBtn?.addEventListener("click", () => {
    hideModal("login-modal", "login-modal--active");
  });

  loginModalOverlay?.addEventListener("click", (e) => {
    hideModal("login-modal", "login-modal--active");
  });

  submitPhoneNumberBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    submittingHandler();
  });

  sendOtpBtn?.addEventListener("click", (e) => {
    verifyOtp();
  });

  reSendOtpBtn?.addEventListener("click", (e) => {
    requestNewOtpCode();
  });
  // finish login modal

  // start create post events
  createPostBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    if (isUserLogin) {
      location.href = "/pages/new.html";
    } else {
      hideModal("header__category-menu", "header__category-menu--active");
      showModal("login-modal", "login-modal--active");
    }
  });


});
