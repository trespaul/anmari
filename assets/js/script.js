// mobile menu toggle
const btn = document.querySelector("button.mobile-menu-toggle");
const menu = document.querySelector(".mobile-menu");
btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});
