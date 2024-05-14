import { getSearchResults } from "../../../utils/shared.js";
import { getUrlParam } from "../../../utils/utils.js";

window.addEventListener("load", () => {
  const loading = document.querySelector("#loading-container");
  const searchTitle = document.querySelector(".search-title span");
  const searchResults = document.querySelector("#search-results");
  const key = getUrlParam("key");

  getSearchResults(key).then((results) => {
    loading.style.display = "none";
    searchTitle.innerHTML = ` «${key}»`;

    console.log(results);

    if (results.length) {
      results.forEach((result) => {
        searchResults.insertAdjacentHTML(
          "beforeend",
          `
            <a href="/pages/support/article.html?id=${result._id}">
                <div>
                    <p>${result.title}</p>
                </div>
                <i class="bi bi-chevron-left"></i>
            </a>
            `
        );
      });
    } else {
      searchResults.insertAdjacentHTML(
        "beforeend",
        `
              <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg" />
              <p>نتیجه‌ای برای جستجوی شما یافت نشد</p>
              <span>پیشنهاد می‌کنیم:</span>
              <span>نگارش کلمات خود را بررسی نمایید.</span>
              <span>کلمات کلیدی دیگری را انتخاب کنید.</span>
            `
      );
    }
  });
});
