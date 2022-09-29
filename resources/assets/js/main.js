const btnMenu = document.querySelector(".m-menu-icon-btn");
const sidebar = document.querySelector(".m-sidebar");

btnMenu.addEventListener("click", toggleSideBar)

function toggleSideBar() {
  sidebar.classList.toggle("m-collapsed")
}