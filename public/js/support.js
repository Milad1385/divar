import { baseUrl, getAllArticles } from "../../utils/shared.js";

window.addEventListener("load", () => {
  const loader = document.querySelector("#loading-container");
  const popularArticles = document.querySelector("#popular-articles");
  const categoriesContainer = document.querySelector("#categories-container");
  const searchInput = document.querySelector("#search-input");
  const removeIcon = document.querySelector("#remove-icon");
  const searchResult = document.querySelector("#search-result");

  getAllArticles().then((categories) => {
    loader.style.display = "none";
    console.log(categories);
    const articles = categories.flatMap((category) => category.articles);
    console.log(articles);

    articles.forEach((article) => {
      popularArticles.insertAdjacentHTML(
        "beforeend",
        `
          <a href="/pages/support/article.html?id=${
            article._id
          }" class="article">
            <p>${article.title}</p>
            <span>${article.body.slice(0, 180)} ...</span>
            <div>
              <i class="bi bi-arrow-left"></i>
              <p>ادامه مقاله</p>
            </div>
          </a>
      `
      );
    });

    categories.forEach((category) => {
      categoriesContainer.insertAdjacentHTML(
        "beforeend",
        `
        <a href="/pages/support/articles.html?id=${category._id}">
          <img src="${baseUrl}/${category.pic.path}" width="64" height="64" alt="" />
          <div>
            <p>${category.name}</p>
            <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از</span>
          </div>
          <i class="bi bi-chevron-left"></i>
        </a>
      `
      );
    });

    searchInput.addEventListener("keyup", (e) => {
      searchResult.innerHTML = "";
      if (e.target.value.trim()) {
        searchResult.classList.add("active");
        removeIcon.classList.add("active");

        const searched = articles.filter((article) =>
          article.title.includes(e.target.value.trim())
        );

        if (searched.length) {
          searchResult.insertAdjacentHTML(
            "beforeend",
            `
            <a href="/pages/support/search.html?key=${e.target.value.trim()}">
              <i class="bi bi-search"></i>
              ${e.target.value.trim()}
            </a>

          `
          );
          searched.forEach((search) => {
            searchResult.insertAdjacentHTML(
              "beforeend",
              `
              <a href="/pages/support/article.html?id=${search._id}">
                <i class="bi bi-card-text"></i>
                ${search.title}
              </a>
            `
            );
          });
        } else {
          searchResult.insertAdjacentHTML(
            "beforeend",
            `
            <a href="/pages/support/search.html?key=${e.target.value.trim()}">
              <i class="bi bi-search"></i>
              ${e.target.value.trim()}
            </a>

          `
          );
        }
      } else {
        searchResult.classList.remove("active");
        removeIcon.classList.remove("active");
      }
    });

    removeIcon.addEventListener("click", () => {
      searchInput.value = "";
      searchResult.classList.remove("active");
      removeIcon.classList.remove("active");
    });
  });
});
