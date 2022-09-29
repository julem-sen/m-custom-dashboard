const btnMenu = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");

btnMenu.addEventListener("click", toggleSideBar)

function toggleSideBar() {
  sidebar.classList.toggle("collapsed")
}