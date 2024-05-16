import { baseUrl, getAllLocations } from "../../../utils/shared.js";
import { getUrlParam, showSwal } from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const categoryTitle = document.querySelector(".category_details p");
  const citySelectBox = document.querySelector("#city-select");
  const neighborhoodSelectBox = document.querySelector("#n-select");
  const productsFieldsContainer = document.querySelector(".product-field");
  const imageUploader = document.querySelector(".image-uploader");
  const imageContainer = document.querySelector(".image-container");

  const categoryID = getUrlParam("id");
  const res = await fetch(`${baseUrl}/v1/category/sub/${categoryID}`);

  const {
    data: { category },
  } = await res.json();

  console.log(category);
  const productsFields = {};
  let pics = [];
  categoryTitle.innerHTML = category.title;
  loading.style.display = "none";

  category.productFields.forEach((field) => {
    productsFieldsContainer.insertAdjacentHTML(
      "beforeend",
      `
      ${
        field.type === "selectbox"
          ? `
      
            <div class="group">
              <p class="title">${field.name}</p>
              <label class="select" for="slct">
                <select id="slct" required="required" onchange="handleFieldChange('${
                  field.slug
                }' , event.target.value)">
                <option value="-1">لطفا ${field.name} را انتخاب کنید</option>
                  ${field.options.map((option) => `<option>${option}</option>`)}
                </select>
                <svg>
                  <use xlink:href="#select-arrow-down"></use>
                </svg>
              </label>
              <svg class="sprites">
                <symbol id="select-arrow-down" viewbox="0 0 10 6">
                  <polyline points="1 1 5 5 9 1"></polyline>
                </symbol>
              </svg>
            </div>
      `
          : `
          
          <div class="form-check mt-5">
            <label class="form-check-label" for="${field.name}">
              ${field.name}
            </label>
            <input onchange="handleFieldChange('${field.slug}' , event.target.checked)" class="form-check-input fs-3" type="checkbox" id="${field.name}">
          </div>
          `
      }
    `
    );
  });

  window.handleFieldChange = (slug, value) => {
    // console.log(slug, value);
    productsFields[slug] = value;
    console.log(productsFields);
  };

  category.productFields.forEach((field) => {
    if (field.type === "selectbox") {
      productsFields[field.slug] = null;
    } else {
      productsFields[field.slug] = false;
    }
  });

  imageUploader.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      ) {
        pics.push(file);
        console.log(URL.createObjectURL(file));
        generateImage(pics);
      } else {
        showSwal("فرمت تصویر معتبر نیست", "error", "متوجه شدم", () => {});
      }
    }
  });

  const generateImage = (pics) => {
    imageContainer.innerHTML = "";
    pics.forEach((pic) => {
      imageContainer.insertAdjacentHTML(
        "beforeend",
        `
            <div class="image">
              <div class="trash" onclick="deleteImage('${pic.name}')">
                <i class="bi bi-trash"></i>
              </div>
              <img
                width="100"
                height="100"
                class="upload-image mt-3"
                src="${URL.createObjectURL(pic)}"
              />
            </div>
        `
      );
    });
  };

  window.deleteImage = (picName) => {
    pics = pics.filter((pic) => pic.name !== picName);
    generateImage(pics);
  };

  getAllLocations().then((data) => {
    loading.style.display = "none";

    const cityChoices = new Choices(citySelectBox);
    const neighborhoodChoices = new Choices(neighborhoodSelectBox);

    const tehranNeighborhood = data.neighborhoods.filter(
      (neighborhood) => neighborhood.city_id === 301 // 301 is tehran code
    );

    const neighborhoodChoicesConfigs = [
      {
        value: "default",
        label: "انتخاب محله",
        disabled: true,
        selected: true,
      },
      ...tehranNeighborhood.map((neighborhood) => ({
        value: neighborhood.id,
        label: neighborhood.name,
      })),
    ];

    neighborhoodChoices.setChoices(
      neighborhoodChoicesConfigs,
      "value",
      "label",
      false
    );

    cityChoices.setChoices(
      data.cities.map((city) => {
        return {
          value: city.id,
          label: city.name,
          customProperties: { id: city.id || 301 },
          selected: city.name === "تهران" ? true : false,
        };
      }),
      "value",
      "label",
      false
    );

    citySelectBox.addEventListener("addItem", (event) => {
      neighborhoodChoices.clearStore();
      const neighborhoods = data.neighborhoods.filter(
        (neighborhood) =>
          neighborhood.city_id === event.detail.customProperties.id
      );

      if (neighborhoods.length) {
        const neighborhoodChoicesConfigs = [
          {
            value: "default",
            label: "انتخاب محله",
            disabled: true,
            selected: true,
          },
          ...neighborhoods.map((neighborhood) => ({
            value: neighborhood.id,
            label: neighborhood.name,
          })),
        ];

        neighborhoodChoices.setChoices(
          neighborhoodChoicesConfigs,
          "value",
          "label",
          false
        );
      } else {
        neighborhoodChoices.setChoices(
          [
            {
              value: 0,
              label: "محله‌ای یافت نشد",
              disabled: true,
              selected: true,
            },
          ],
          "value",
          "label",
          false
        );
      }
    });
  });
});
