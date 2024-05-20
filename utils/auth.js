import { baseUrl } from "./shared.js";
import { hideModal, setToLocalstorage, showSwal } from "./utils.js";

const phoneNumberInput = document.querySelector(".phone_Number_input");
const step1LoginFormError = document.querySelector(".step-1-login-form__error");
const loginModal = document.querySelector("#login-modal");
const requestTimerContainer = document.querySelector(".request_timer p");
const requestTimerSpan = document.querySelector(".request_timer span");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");
const loginChangeNumberBtn = document.querySelector(".login-change-number");
const loginModalOtpInput = document.querySelector(".code_input");
const step2LoginFormError = document.querySelector(".step-2-login-form__error");
const loadingContainer = document.querySelector("#loading-container");
const userNumberNotice = document.querySelector(".user_number_notice");
let timer = null;
let count = null;

const sendOtpBtn = document.querySelector(".login_btn");

const submittingHandler = async () => {
  loadingContainer.classList.add("active-login-loader");
  const phoneRegex = /^(09)[0-9]{9}$/g;
  const phoneNumber = phoneNumberInput.value.trim();
  const isValidPhoneNumber = phoneRegex.test(phoneNumber);
  userNumberNotice.textContent = phoneNumber.toLocaleString("fa");

  if (isValidPhoneNumber) {
    step1LoginFormError.innerHTML = "";
    const res = await fetch(`${baseUrl}/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    if (res.status === 200) {
      loadingContainer.classList.remove("active-login-loader");
      loginModal.classList.add("active_step_2");
      count = 30;
      requestTimerSpan.textContent = count;
      timer = setInterval(() => {
        count--;
        requestTimerSpan.textContent = count;
        if (count === 0) {
          clearInterval(timer);
          requestTimerSpan.style.display = "none";
          reqNewCodeBtn.style.display = "block";
          requestTimerContainer.style.display = "none";
        }
      }, 1000);

      loginChangeNumberBtn?.addEventListener("click", (e) => {
        loginModal.classList.remove("active_step_2");
        count = 0;
        clearInterval(timer);
      });
    }
  } else {
    loadingContainer.classList.remove("active-login-loader");
    step1LoginFormError.innerHTML = "شماره همراه صحیح نیست";
  }
};

const verifyOtp = async () => {
  userNumberNotice.innerHTML = phoneNumberInput.value;
  const otpRegex = /^[1-9]{4}$/g;
  const otpInputValue = loginModalOtpInput.value.trim();
  const isValidOtpCode = otpRegex.test(otpInputValue);

  if (isValidOtpCode) {
    loadingContainer.classList.add("active-login-loader");
    sendOtpBtn.setAttribute("disabled", "true");
    const res = await fetch(`${baseUrl}/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumberInput.value.trim(),
        otp: otpInputValue,
      }),
    });

    console.log(res);

    if (res.status === 200 || res.status === 201) {
      loginModal.classList.remove("active_step_2");
      hideModal("login-modal", "login-modal--active");
      loadingContainer.classList.remove("active-login-loader");
      sendOtpBtn.setAttribute("disabled", "false");
      const result = await res.json();
      setToLocalstorage("token", result.data.token);
      showSwal(
        `کاربر با موفقیت ${res.status === 200 ? "لاگین" : "ثبت نام"} شد`,
        "success",
        "ورود به پنل",
        () => {
          location.href = `/pages/userPanel/verify.html`;
        }
      );
    } else {
      sendOtpBtn.setAttribute("disabled", "false");
      loadingContainer.classList.remove("active-login-loader");
      showSwal(`عملیات با خطا رو به رو شد`, "error", "تلاش مجدد", () => {});
      loginModalOtpInput.value = "";
    }
    // codes
  } else {
    // codes
    step2LoginFormError.innerHTML = "کد ورودی صحیح نیست";
  }
};

const requestNewOtpCode = async () => {
  loadingContainer.classList.add("active-login-loader");
  reqNewCodeBtn.style.display = "none";
  requestTimerSpan.style.display = "block";
  requestTimerContainer.style.display = "block";
  const phoneNumber = phoneNumberInput.value.trim();
  const res = await fetch(`${baseUrl}/v1/auth/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: phoneNumber }),
  });

  if (res.status === 200) {
    loadingContainer.classList.remove("active-login-loader");
    count = 30;
    requestTimerSpan.textContent = count;
    timer = setInterval(() => {
      count--;
      requestTimerSpan.textContent = count;
      if (count === 0) {
        clearInterval(timer);
        requestTimerSpan.style.display = "none";
        reqNewCodeBtn.style.display = "block";
        requestTimerContainer.style.display = "none";
      }
    }, 1000);
  }
};

const logout = () => {
  showSwal(
    "آیا از خروج اطمینان دارید ؟",
    "warning",
    ["خیر", "بله"],
    (result) => {
      if (result) {
        localStorage.removeItem("token");
        showSwal("با موفقیت خروج شدید", "success", "صفحه اصلی", () => {
          location.href = "/pages/posts.html";
        });
      }
    }
  );
};

export { submittingHandler, verifyOtp, requestNewOtpCode, logout };
