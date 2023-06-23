let menuContainer = document.getElementById("Menu_Container");
let settingsContainer = document.getElementById("Settings_Container");
let animalPage = document.getElementById("animalDetails");
document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "profile.html";
});

function menu() {
    if (menuContainer.style.visibility === "hidden") {
        menuContainer.style.animationName = "OpenMenu";
        menuContainer.style.visibility = "visible";
    } else if (menuContainer.style.visibility === "visible") {
        menuContainer.style.animationName = "CloseMenu";
        menuContainer.style.visibility = "hidden";
    }

}


function openHomeContainer(container) {
    if(container===0)
        window.location.href = "home.html#containerHome";
    if(container===1)
        window.location.href = "home.html#containerNews";
    if(container===2)
        window.location.href = "home.html#containerContact";
    if(container===3)
        window.location.href = "home.html#containerAbout";
    if(container===4)
        window.location.href = "shoes.html"
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}


const token = sessionStorage.getItem('token');
function decodeToken(token) {
    const [, payloadBase64] = token.split('.');
    try {
        const payload = JSON.parse(atob(payloadBase64));
        return payload;
    } catch (error) {
        // Handle any errors that occur during decoding
        console.error('Error decoding token:', error);
        return null;
    }
}

decodedToken= decodeToken(token);
const Email = decodedToken.email;

async function loadAnimals(){
    const token = localStorage.getItem('token');
    console.log(Email);
    const response = await fetch("http://localhost:8081/animals/", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    console.log(data);

    let list = document.getElementById("animalList");
    list.innerHTML = "";
    for (let animal of data) {
        let containerAnimal = document.createElement("div");
        let animalPhoto = document.createElement("img");
        let animalName = document.createElement("h2");
        let animalDetailsButton = document.createElement("button");

        animalPhoto.id = "animalPhoto";
        animalName.id = "animalName";
        animalDetailsButton.id = "animalDetailsButton";

        containerAnimal.classList.add("containerAnimal");
        animalPhoto.src = animal.photo;
        animalName.textContent = animal.name;
        animalDetailsButton.textContent = "Details";
        animalDetailsButton.addEventListener("click", () => {
            window.location.href = "shoe.html?id=" + animal.id;
        });

        containerAnimal.appendChild(animalPhoto);
        containerAnimal.appendChild(animalName);
        containerAnimal.appendChild(animalDetailsButton);
        list.appendChild(containerAnimal);
    }
}
async function loadSearchedAnimals(){
    const token = localStorage.getItem('token');
    console.log(Email);
    let url = new URLSearchParams(window.location.search);
    let term = url.get("search");
    console.log(term);
    const response = await fetch("http://localhost:8081/search/" + term, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    console.log(data);

    let list = document.getElementById("animalList");
    list.innerHTML = "";
    for (let animal of data) {
        let containerAnimal = document.createElement("div");
        let animalPhoto = document.createElement("img");
        let animalName = document.createElement("h2");
        let animalDetailsButton = document.createElement("button");

        animalPhoto.id = "animalPhoto";
        animalName.id = "animalName";
        animalDetailsButton.id = "animalDetailsButton";

        containerAnimal.classList.add("containerAnimal");
        animalPhoto.src = animal.photo;
        animalName.textContent = animal.name;
        animalDetailsButton.textContent = "Details";
        animalDetailsButton.addEventListener("click", () => {
            window.location.href = "shoe.html?id=" + animal.id;
        });

        containerAnimal.appendChild(animalPhoto);
        containerAnimal.appendChild(animalName);
        containerAnimal.appendChild(animalDetailsButton);
        list.appendChild(containerAnimal);
    }
}

async function loadFilteredAnimals(){
    const token = localStorage.getItem('token');
    console.log(Email);
    let url = new URLSearchParams(window.location.search);
    let term = url.get("filter");
    const response = await fetch("http://localhost:8081/filter/" + term, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    console.log(data);

    let list = document.getElementById("animalList");
    list.innerHTML = "";
    for (let animal of data) {
        let containerAnimal = document.createElement("div");
        let animalPhoto = document.createElement("img");
        let animalName = document.createElement("h2");
        let animalDetailsButton = document.createElement("button");

        animalPhoto.id = "animalPhoto";
        animalName.id = "animalName";
        animalDetailsButton.id = "animalDetailsButton";

        containerAnimal.classList.add("containerAnimal");
        animalPhoto.src = animal.photo;
        animalName.textContent = animal.name;
        animalDetailsButton.textContent = "Details";
        animalDetailsButton.addEventListener("click", () => {
            window.location.href = "shoe.html?id=" + animal.id;
        });

        containerAnimal.appendChild(animalPhoto);
        containerAnimal.appendChild(animalName);
        containerAnimal.appendChild(animalDetailsButton);
        list.appendChild(containerAnimal);
    }
}

loadAnimals();

if(window.location.href.includes("search")){
    loadSearchedAnimals();
}


if(window.location.href.includes("filter")){
    loadFilteredAnimals();
}

function getFilters(){
    let filterString = "";
    let checkboxes = document.getElementsByClassName("filter-checkbox");
    for(let checkbox of checkboxes){
        if(checkbox.checked && filterString.length !== 0)
            filterString += ' ';
        if (checkbox.checked){
            filterString += checkbox.value;
        }

    }
    console.log(filterString);
    return filterString;
}
