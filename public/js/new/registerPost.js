import { baseUrl, getAllLocations } from "../../../utils/shared.js";
import {
  getMe,
  getToken,
  getUrlParam,
  isLogin,
  showSwal,
} from "../../../utils/utils.js";

window.addEventListener("load", async () => {
  const loading = document.querySelector("#loading-container");
  const categoryTitle = document.querySelector(".category_details p");
  const citySelectBox = document.querySelector("#city-select");
  const neighborhoodSelectBox = document.querySelector("#n-select");
  const productsFieldsContainer = document.querySelector(".product-field");
  const imageUploader = document.querySelector(".image-uploader");
  const imageContainer = document.querySelector(".image-container");
  const changeIcon = document.querySelector(".icon-controll");
  const sendPostBtn = document.querySelector("#send-post");
  const exchange = document.querySelector("#exchange");
  const priceInput = document.querySelector("#price");
  const titleInput = document.querySelector("#title");
  const descInput = document.querySelector("#desc");

  const isUserLogin = await isLogin();
  if (!isUserLogin) {
    location.href = "/pages/posts.html";
  }

  const categoryID = getUrlParam("id");
  const res = await fetch(`${baseUrl}/v1/category/sub/${categoryID}`);

  const {
    data: { category },
  } = await res.json();

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
    productsFields[slug] = value;
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
      data.cities.map((city) => ({
        value: city.id,
        label: city.name,
        customProperties: { id: city.id || 301 },
        selected: city.name === "تهران" ? true : false,
      })),
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

  // handle map
  let mapView = { x: 35.715298, y: 51.404343 };
  let markerIcon = null;
  let iconStatus = "FIRST_ICON";

  const map = L.map("map").setView([35.715298, 51.404343], 13);

  let firstIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  let secondIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  markerIcon = firstIcon;

  let marker = L.marker([35.715298, 51.404343], { icon: firstIcon }).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  map.on("move", () => {
    const center = map.getSize().divideBy(2);
    const target = map.containerPointToLayerPoint(center);
    const latlng = map.layerPointToLatLng(target);

    marker.setLatLng(latlng);

    mapView = {
      x: latlng.lat,
      y: latlng.lng,
    };
  });

  changeIcon.addEventListener("change", () => {
    if (iconStatus === "FIRST_ICON") {
      markerIcon = secondIcon;
      marker.setIcon(markerIcon);
      iconStatus = "SECOND_ICON";
    } else {
      markerIcon = firstIcon;
      marker.setIcon(markerIcon);
      iconStatus = "FIRST_ICON";
    }
  });

  // send info to server
  sendPostBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // validation dynamic fields
    let allFieldsFilled = true;

    for (const key in productsFields) {
      if (productsFields[key] === null) {
        allFieldsFilled = false;
      }
    }

    if (
      !allFieldsFilled ||
      !priceInput.value.trim() ||
      !titleInput.value.trim() ||
      !descInput.value.trim() ||
      citySelectBox.value === "default" ||
      neighborhoodSelectBox.value === "default"
    ) {
      return showSwal(
        "لطفا همه اطلاعات را وارد کنید",
        "error",
        "متوجه شدم",
        () => {}
      );
    }

    const formData = new FormData();

    formData.append("city", citySelectBox.value);
    formData.append("neighborhood", neighborhoodSelectBox.value);
    formData.append("description", descInput.value.trim());
    formData.append("price", priceInput.value.trim());
    formData.append("exchange", exchange.checked);
    formData.append("map", JSON.stringify(mapView));
    formData.append("title", titleInput.value.trim());
    formData.append("categoryFields", JSON.stringify(productsFields));
    pics.forEach((pic) => {
      formData.append("pics", pic);
    });

    const res = await fetch(`${baseUrl}/v1/post/${categoryID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (res.status === 201) {
      showSwal(
        "آگهی مورد نظر با موفقیت در صف انتشار قرار گرفت",
        "success",
        "اوکی",
        () => {
          location.href = `/pages/userPanel/posts/preview.html`;
        }
      );
    }
  });
});
