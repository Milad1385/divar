import { getSameArticles, getSingleArticle } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  const loading = document.querySelector("#loading-container");
  const breadcrumb = document.querySelector(".breadcrumb span");
  const articleTitle = document.querySelector("#article-title");
  const articleBody = document.querySelector("#article-body");
  const sameArticlesContainer = document.querySelector("#same-articles");
  const articleID = getUrlParam("id");
  getSingleArticle(articleID).then(async (article) => {
    loading.style.display = "none";
    breadcrumb.innerHTML = article.title;
    articleTitle.innerHTML = article.title;
    articleBody.innerHTML = article.body;

    document.title = article.title;

    const sameArticles = await getSameArticles(article.categories[0]);
    sameArticles
      .filter((article) => article._id !== articleID)
      .forEach((article) => {
        sameArticlesContainer.insertAdjacentHTML(
          "beforeend",
          `
            <a href="/pages/support/article.html?id=${article._id}">${article.title}</a>
        `
        );
      });
  });
});
