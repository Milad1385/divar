import { baseUrl, getAllArticles } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  const categoryID = getUrlParam("id");
  const loading = document.querySelector("#loading-container");
  const breadcrumbSpan = document.querySelector("#breadcrumb span");
  const articlesContainer = document.querySelector("#articles");
  const categoryInfo = document.querySelector("#category-info");

  getAllArticles().then((categories) => {
    loading.style.display = "none";
    console.log(categories);

    const category = categories.find(
      (category) => category._id === categoryID
    );

    console.log(category);

    categoryInfo.insertAdjacentHTML(
      "beforeend",
      `
    
        <img class="category-info-icon" src="${baseUrl}/${category.pic.path}" />
        <p class="category-info-title">${category.name}</p>
    `
    );

    category.articles.map((article) => {
      articlesContainer.insertAdjacentHTML(
        "beforeend",
        `
              <a href="/pages/support/article.html?id=${
                article._id
              }" class="article">
                  <div>
                      <p>${article.title}</p>
                      <span>${article.body.slice(0, 180)} ...</span>
                  </div>
                  <i class="bi bi-arrow-left"></i>
              </a>
          `
      );
    });
  });
});
