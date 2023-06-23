let home = document.getElementById("containerHome");
let about = document.getElementById("containerAbout");
let services = document.getElementById("containerServices");
let contact = document.getElementById("containerContact");
let news = document.getElementById("containerNews");
let homeContainers = [home, news, contact, about];

let menuContainer = document.getElementById("Menu_Container");
document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "profile.html";
});


function openHomeContainer(container) {
    for (let i = 0; i < 5; i++) {
        if (container === 4)
            window.location.href = "shoes.html"
        else {
            homeContainers[i].style.display = "none";
            homeContainers[container].style.display = "block";
        }
    }
}


function menu() {
    if (menuContainer.style.visibility === "hidden") {
        menuContainer.style.animationName = "OpenMenu";
        menuContainer.style.visibility = "visible";
    } else if (menuContainer.style.visibility === "visible") {
        menuContainer.style.animationName = "CloseMenu";
        menuContainer.style.visibility = "hidden";
    }

}

console.log(sessionStorage);

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

window.onload = function () {
    if (window.location.hash === "#containerHome")
        openHomeContainer(0);
    if (window.location.hash === "#containerServices")
        openHomeContainer(1);
    if (window.location.hash === "#containerTickets")
        openHomeContainer(2);
    if (window.location.hash === "#containerNews")
        openHomeContainer(3);
    if (window.location.hash === "#containerContact")
        openHomeContainer(4);
    if (window.location.hash === "#containerAbout")
        openHomeContainer(5);
};