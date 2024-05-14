import { getAllCategories } from "../../utils/shared.js";

window.addEventListener("load", () => {
  const loading = document.querySelector("#loading-container");
  const switchElem = document.querySelector(".icon-controll");
  const categoriesList = document.querySelector("#boxes-container");

  getAllCategories().then((categories) => {
    loading.style.display = "none";
    console.log(categories);

    const generateCategories = (categories, title) => {
      categoriesList.innerHTML = "";

      if (title) {
        categoriesList.insertAdjacentHTML(
          "beforeend",
          `
          <div class="box">
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
        generateCategories(category.subCategories, "همه دسته بندی ها");
      } else {
        // codes
        const allSubCategories = categories.flatMap(
          (subCategory) => subCategory.subCategories
        );
        const subCategory = allSubCategories.find(
          (subCategory) => subCategory._id === categoryId
        );
        if (subCategory) {
          generateCategories(subCategory.subCategories, subCategory.title);
        } else {
          location.href = `/pages/new/registerPost.html?id=${categoryId}`;
        }
      }
    };

    generateCategories(categories);

    switchElem?.addEventListener("change", () => {
      generateCategories(categories);
    });
  });
});
