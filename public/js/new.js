import { getAllCategories } from "../../utils/shared.js";

window.addEventListener("load", () => {
  const loading = document.querySelector("#loading-container");
  const switchElem = document.querySelector(".icon-controll");
  const categoriesList = document.querySelector("#boxes-container");
  const showCategoies = document.querySelector(".show-categoies");
  const allCategories = document.querySelector(".all-categories");
  const searchInput = document.querySelector(".search_box input");
  const searchResultContainer = document.querySelector(".result");
  const deleteIcon = document.querySelector(".bi-x");

  showCategoies.addEventListener("click", () => {
    showCategoies.classList.remove("active");
    allCategories.classList.add("active");
  });

  getAllCategories().then((categories) => {
    loading.style.display = "none";
    console.log(categories);

    const generateCategories = (categories, title, id) => {
      categoriesList.innerHTML = "";

      if (title) {
        categoriesList.insertAdjacentHTML(
          "beforeend",
          `
          <div class="box" onclick="${
            id ? `backToMainSubCategory('${id}')` : `backToAllCategories()`
          }">
              <div class="box_haeder">
                  <div class="box__title">
                      <p>بازگشت به ${title}</p>
                  </div>
                  <i class="bi bi-chevron-left"></i>
              </div>
          </div>
        `
        );
      }
      categories.forEach((category) => {
        categoriesList.insertAdjacentHTML(
          "beforeend",
          `
            <div class="box" onclick="categoryBoxClickHandler('${
              category._id
            }')">
                <div class="box_haeder">
                    <div class="box__title">
                        <i class="bi bi-house-door"></i>
                        <p>${category.title}</p>
                    </div>
                    <i class="bi bi-chevron-left"></i>
                </div>
               ${
                 switchElem.checked
                   ? ` <div class="box__desc">${category.description}</div>`
                   : ``
               }
            </div>
        `
        );
      });
    };

    window.categoryBoxClickHandler = (categoryId) => {
      const category = categories.find(
        (category) => category._id === categoryId
      );

      if (category) {
        generateCategories(category.subCategories, "همه دسته بندی ها", null);
      } else {
        // codes
        const allSubCategories = categories.flatMap(
          (subCategory) => subCategory.subCategories
        );
        const subCategory = allSubCategories.find(
          (subCategory) => subCategory._id === categoryId
        );
        // console.log(subCategory);
        if (subCategory) {
          const subCategoryParent = categories.find(
            (category) => category._id === subCategory.parent
          );
          console.log(subCategoryParent);
          generateCategories(
            subCategory.subCategories,
            subCategoryParent.title,
            subCategoryParent._id
          );
        } else {
          location.href = `/pages/new/registerPost.html?id=${categoryId}`;
        }
      }
    };

    window.backToMainSubCategory = (id) => {
      categoryBoxClickHandler(id);
    };
    window.backToAllCategories = () => {
      generateCategories(categories);
    };

    generateCategories(categories);

    switchElem.addEventListener("change", () => {
      generateCategories(categories);
    });

    const getAllSubSubCategories = () => {
      const subCategories = categories.flatMap(
        (category) => category.subCategories
      );

      const subSubCategories = subCategories.flatMap(
        (subCategory) => subCategory.subCategories
      );
      return subSubCategories;
    };

    const subSubCategories = getAllSubSubCategories();

    searchInput.addEventListener("keyup", (e) => {
      if (e.target.value.trim()) {
        searchResultContainer.innerHTML = "";
        deleteIcon.classList.add("active");
        searchResultContainer.classList.add("active");
        const searched = subSubCategories.filter((category) =>
          category.title.includes(e.target.value)
        );

        if (searched.length) {
          searched.forEach((search) => {
            searchResultContainer.insertAdjacentHTML(
              "beforeend",
              `
               <p>
                <a href="/pages/new/registerPost.html?id=${search._id}">${search.title}</a>
               </p>
            `
            );
          });
        } else {
          searchResultContainer.insertAdjacentHTML(
            "beforeend",
            `
          
            <div class="d-flex align-items-center justify-content-center flex-column">
              <img src="/public/images/download.svg" width="200px">
              <h3 class="pb-5 fs-4">نتیجه ای برای جستجو شما یافت نشد</h3>
            </div>

          `
          );
        }
      } else {
        deleteIcon.classList.remove("active");
        searchResultContainer.classList.remove("active");
      }
    });

    deleteIcon.addEventListener("click", () => {
      searchResultContainer.innerHTML = "";
      searchResultContainer.classList.remove("active");
      deleteIcon.classList.remove("active");
      searchInput.value = "";
    });
  });
});
