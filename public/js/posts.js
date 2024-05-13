import { baseUrl, getAllCategories, getAllPosts } from "../../utils/shared.js";
import {
  addToUrlParam,
  calculateRelativeTimeDeffrence,
  getLocalstorage,
  getUrlParam,
  deleteUrlParam,
} from "../../utils/utils.js";

window.addEventListener("load", () => {
  const categoriesContainer = document.querySelector(".sidebar__category-item");
  const filtersContainer = document.querySelector("#sidebar-filters");
  const loadingElem = document.querySelector("#loading-container");
  const justPhotoController = document.querySelector("#just_photo_controll");
  const exchangeController = document.querySelector("#exchange_controll");
  const minPriceSelectbox = document.querySelector("#min-price-selectbox");
  const maxPriceSelectbox = document.querySelector("#max-price-selectbox");
  const cities = getLocalstorage("cities");
  const categoryId = getUrlParam("category");
  const cityIds = cities.map((city) => city.id).join("|");

  if (cities.length === 1) {
    document.title = `دیوار ${cities[0].name}: مرجع انواع نیازمندی و آگهی‌های نو و دست دو در شهر ${cities[0].name}`;
  } else {
    document.title = `دیوار ${cities.length} شهر ، مرجع تمام نیازمندی ها و آگهی های دسته دوم در ${cities.length} شهر`;
  }

  let posts = null;
  let filtersPosts = {}; // {key : value}

  getAllPosts(cityIds || "301").then((res) => {
    loadingElem.style.display = "none";
    posts = res.data.posts;
    console.log(posts);
    generatePosts(posts);
  });

  getAllCategories().then((categories) => {
    categoriesContainer.innerHTML = "";
    if (categoryId) {
      const mainCategory = categories.filter(
        (category) => category._id === categoryId
      );

      if (mainCategory.length) {
        mainCategory.forEach((category) => {
          categoriesContainer.insertAdjacentHTML(
            `beforeend`,
            `
                <div class="all-categories">
                  <p onclick="backToMainCategories()">همه اگهی ها</p>
                  <i class="bi bi-arrow-right"></i>
                </div>
  
                <div class="sidebar__category-link active-category" href="#">
                  <div class="sidebar__category-link_details">
                    <i class="sidebar__category-icon bi bi-house"></i>
                    <p onclick="categoryClickHandler('${category._id}')">${
              category.title
            }</p>
                  </div>
                </div>
                 <ul class="subCategory-list d-block">
                  ${category.subCategories.map(createSubCategoryHtml).join("")}
                </ul>
      
        `
          );
        });
      } else {
        const subCategory = getSubCategoriesById(categories, categoryId);
        subCategory?.filters.forEach((filter) => generateFilter(filter));

        if (subCategory) {
          categoriesContainer.insertAdjacentHTML(
            "beforeend",
            `
                <div class="all-categories">
                  <p onclick="backToMainCategories()">همه اگهی ها</p>
                  <i class="bi bi-arrow-right"></i>
                </div>
    
                <div class="sidebar__category-link active-category" href="#">
                  <div class="sidebar__category-link_details">
                    <i class="sidebar__category-icon bi bi-house"></i>
                    <p onclick="categoryClickHandler('${subCategory._id}')">${
              subCategory.title
            }</p>
                  </div>
                </div>
                <ul class="subCategory-list d-block">
                  ${subCategory.subCategories
                    .map(createSubCategoryHtml)
                    .join("")}
                </ul>
  
          `
          );
        } else {
          // sub sub category
          const subSubCategory = getSubSubCategoriesById(
            categories,
            categoryId
          );
          // find parent of subSub category
          const subSubCategoryParent = getSubCategoriesById(
            categories,
            subSubCategory.parent
          );

          subSubCategory?.filters.forEach((filter) => generateFilter(filter));

          categoriesContainer.insertAdjacentHTML(
            "beforeend",
            `
              <div class="all-categories">
                <p onclick="backToMainCategories()">همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#">
                <div class="sidebar__category-link_details">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p onclick="categoryClickHandler('${
                    subSubCategoryParent._id
                  }')">${subSubCategoryParent.title}</p>
                </div>
              </div>
              <ul class="subCategory-list d-block">
                ${subSubCategoryParent.subCategories
                  .map(createSubCategoryHtml)
                  .join("")}
              </ul>
          `
          );
        }
      }
    } else {
      categories.forEach((category) => {
        categoriesContainer.insertAdjacentHTML(
          "beforeend",
          `
            <a class="sidebar__category-link" onclick="categoryClickHandler('${category._id}')">
              <i class="sidebar__category-icon bi bi-house"></i>
             ${category.title}
            </a>
        `
        );
      });
    }
  });

  const getSubCategoriesById = (categories, categoryId) => {
    const subCategories = categories.flatMap(
      (category) => category.subCategories
    );

    return subCategories.find((subcategory) => subcategory._id === categoryId);
  };

  const getSubSubCategoriesById = (categories, categoryId) => {
    const subCategories = categories.flatMap(
      (category) => category.subCategories
    );

    const subSubCategories = subCategories.flatMap(
      (subCategory) => subCategory.subCategories
    );

    return subSubCategories.find(
      (subSubcategory) => subSubcategory._id === categoryId
    );
  };

  const generatePosts = (posts) => {
    const postsContainer = document.querySelector("#posts-container");
    postsContainer.innerHTML = "";
    if (posts.length) {
      posts.forEach((post) => {
        const date = calculateRelativeTimeDeffrence(post.createdAt);
        postsContainer.insertAdjacentHTML(
          "beforeend",
          `
              <div class="col-4">
                <a href="post.html?id=${post._id}" class="product-card">
                  <div class="product-card__right">
                    <div class="product-card__right-top">
                      <p class="product-card__link">${post.title}</p>
                    </div>
                    <div class="product-card__right-bottom">
                      <span class="product-card__condition">${
                        post.dynamicFields[0].data
                      }</span>
                      <span class="product-card__price">
                        ${
                          post.price === 0
                            ? "توافقی"
                            : post.price.toLocaleString("fa") + " تومان"
                        }
                      </span>
                      <span class="product-card__time">${date}</span>
                    </div>
                  </div>
                  <div class="product-card__left">
                  ${
                    post.pics.length
                      ? `
                        <img
                          class="product-card__img img-fluid"
                          src="${baseUrl}/${post.pics[0].path}"
                        />`
                      : `
                        <img
                          class="product-card__img img-fluid"
                          src="/public/images/main/noPicture.PNG"
                        />`
                  }
                    
                  </div>
                </a>
              </div>
          
            `
        );
      });
    } else {
      postsContainer.innerHTML = '<p class="empty">آگهی یافت نشد</p>';
    }
  };

  const createSubCategoryHtml = (category) => {
    return ` <li class="${
      categoryId === category._id ? "active-subCategory" : ""
    }" onclick="categoryClickHandler('${category._id}')">
    ${category.title}
  </li>`;
  };

  const generateFilter = (filter) => {
    filtersContainer.insertAdjacentHTML(
      "beforebegin",
      `
      ${
        filter.type === "selectbox"
          ? `
          <div
          class="accordion accordion-flush"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filter-${filter._id}"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                <span class="sidebar__filter-title">${filter.name}</span>
              </button>
            </h2>
            <div
              id="filter-${filter._id}"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <div class="sidebar__filter-price sidebar__filter-item">
                  <div class="sidebar__filter-price-wrapper">
                    <label class="sidebar__filter-price-label"
                      >حداقل</label
                    >
                    <select name id="min-price-selectbox" onchange="dynamicFiltering('${
                      filter.slug
                    }',event.target.value)">
                      ${filter.options
                        .reverse()
                        .map((option) => `<option>${option}</option>`)}
                    </select>
      
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
          : ""
      }

      ${
        filter.type === "checkbox"
          ? `
      
            <div class="sidebar__filter">
              <label class="switch">
                <input
                  id="exchange_controll"
                  class="icon-controll"
                  type="checkbox"
                />
                <span class="slider round"></span>
              </label>
              <p>${filter.name}</p>
            </div>
      `
          : ""
      }
    `
    );
  };

  const applyFilter = () => {
    let filteredPosts = [...posts];

    if (justPhotoController.checked) {
      filteredPosts = filteredPosts.filter((post) => post.pics.length);
    }

    if (exchangeController.checked) {
      filteredPosts = filteredPosts.filter((post) => post.exchange);
    }

    if (maxPriceSelectbox.value !== "default") {
      if (minPriceSelectbox.value !== "default") {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.price >= minPriceSelectbox.value &&
            post.price <= maxPriceSelectbox.value
        );
      } else {
        filteredPosts = filteredPosts.filter(
          (post) => post.price <= maxPriceSelectbox.value
        );
      }
    } else {
      if (minPriceSelectbox.value !== "default") {
        filteredPosts = filteredPosts.filter(
          (post) => post.price >= minPriceSelectbox.value
        );
      }
    }

    // dynamic filtering
    for (const slug in filtersPosts) {
      filteredPosts = filteredPosts.filter((post) =>
        post.dynamicFields.some(
          (field) => field.slug === slug && field.data === filtersPosts[slug]
        )
      );
    }

    generatePosts(filteredPosts);
  };

  justPhotoController?.addEventListener("change", (e) => {
    applyFilter();
  });
  
  exchangeController?.addEventListener("change", (e) => {
    applyFilter();
  });

  minPriceSelectbox?.addEventListener("change", (e) => {
    applyFilter();
  });

  maxPriceSelectbox?.addEventListener("change", (e) => {
    applyFilter();
  });

  window.categoryClickHandler = (id) => {
    addToUrlParam("category", id);
  };

  window.backToMainCategories = () => {
    deleteUrlParam("category");
  };

  window.dynamicFiltering = (key, value) => {
    filtersPosts[key] = value;
    applyFilter();
  };
});
