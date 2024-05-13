import { getAllCities } from "../../utils/shared.js";
import { getLocalstorage, setToLocalstorage } from "../../utils/utils.js";

window.addEventListener("load", () => {
  const loadingContainer = document.querySelector("#loading-container");

  getAllCities().then((response) => {
    loadingContainer.style.display = "none";
    const popularCitiesContainer = document.querySelector("#popular-cities");
    const searchInputElem = document.querySelector("#search-input");
    const searchResultCitiesElem = document.querySelector(
      ".search-result-cities"
    );

    // search handler
    searchInputElem.addEventListener("input", (e) => {
      let inputValue = e.target.value;
      if (inputValue.length) {
        searchResultCitiesElem.classList.add("active");

        const searchedCities = response.data.cities.filter((city) =>
          city.name.startsWith(inputValue)
        );

        searchResultCitiesElem.innerHTML = "";

        if (searchedCities.length) {
          searchedCities.forEach((city) => {
            searchResultCitiesElem.insertAdjacentHTML(
              `beforeend`,
              `
              <li onclick="cityClickHandler('${city.name}', '${city.id}')">${city.name}</li>
            `
            );
          });
        } else {
          searchResultCitiesElem.insertAdjacentHTML(
            "beforeend",
            `
            <img src="public/images/download.svg" width="200px"/>
            <h3>نتیجه ای برای جستجو شما یافت نشد.</h3>
          `
          );
        }
      } else {
        searchResultCitiesElem.classList.remove("active");
      }
    });

    const popularCities = response.data.cities.filter((city) => city.popular);
    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML(
        "beforeend",
        `
        <li class="main__cities-item" onclick="cityClickHandler('${city.name}', '${city.id}')">
            <p class="main__cities-link">${city.name}</p>
        </li>
      `
      );
    });

    window.cityClickHandler = (cityName, cityId) => {
      setToLocalstorage("cities", [{ name: cityName, id: cityId }]);
      location.href = "pages/posts.html";
    };
  });

  const isChooseCity = getLocalstorage("cities").length ? true : false;
  if (isChooseCity) {
    location.href = "/pages/posts.html";
  }
});
