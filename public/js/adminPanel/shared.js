import { getMe } from "./../../../utils/utils.js";
import { logout as logoutHandler } from "./../../../utils/auth.js";
window.addEventListener("load", async () => {
  const user = await getMe();
  const sidebarPhoneNumber = document.querySelector(".sidebar-title span");
  const logoutBtn = document.querySelector(".logout");

  logoutBtn?.addEventListener("click", (e) => {
    logoutHandler();
  });

  if (user.role === "ADMIN") {
    sidebarPhoneNumber.innerHTML = user.phone;
  } else {
    location.href = "/pages/posts.html";
  }
});
