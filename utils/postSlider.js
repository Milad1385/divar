const swiper2 = new Swiper(".mySwiper", {
  slidesPerView: 6,
  spaceBetween: 15,
  // Navigation arrows
});

const swiper = new Swiper(".mySwiper2", {
  slidesPerView: 1,
  spaceBetween: 10,
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper2,
  },
});
