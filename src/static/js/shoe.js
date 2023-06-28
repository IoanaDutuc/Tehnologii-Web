let menuContainer = document.getElementById("Menu_Container");
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

let shoe;
async function openShoeDescription(id) {

    const token = localStorage.getItem('token');
    console.log(Email);
    const response = await fetch("http://localhost:8081/shoe/" + id, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    shoe = await response.json();
    console.log(shoe);
    download();

    let photo = document.getElementById("photo");
    let description = document.getElementById("description");
    let name = document.getElementById("name");
    let brand = document.getElementById("brand");
    let type = document.getElementById("type");
    let color = document.getElementById("color");
    let occasion = document.getElementById("occasion");
    let material = document.getElementById("material");
    let technologies = document.getElementById("technologies");

    photo.src = shoe.photo;
    description.textContent = ` ${shoe.description}`;
    name.textContent = `Name: ${shoe.name}`;
    brand.textContent = `Brand: ${shoe.brand}`
    type.textContent = `Type: ${shoe.type}`
    color.textContent = `Color: ${shoe.color}`
    occasion.textContent = `Occasion: ${shoe.occasion}`
    material.textContent = `Material: ${shoe.material}`
    if(shoe.technologies === null)
        technologies.textContent = `Technologies: none`
    else
        technologies.textContent = `Technologies: ${shoe.technologies}`
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

let params = new URLSearchParams(window.location.search);
openShoeDescription(params.get("id"));

function download(){
    let button = document.getElementById("downloadButton");
    button.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shoe)));
    button.setAttribute("download", shoe.name + ".json");
}