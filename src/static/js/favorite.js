let menuContainer = document.getElementById("Menu_Container");
let shoePage = document.getElementById("shoeDetails");
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

async function loadFavoriteShoes(){
    const token = localStorage.getItem('token');
    console.log(Email);
    const response = await fetch("http://localhost:8081/shoes/favorite/page", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    console.log(data);

    let list = document.getElementById("shoeList");
    list.innerHTML = "";
    for (let shoe of data) {
        let containerShoe = document.createElement("div");
        let shoePhoto = document.createElement("img");
        let shoeName = document.createElement("h2");
        let shoeDetailsButton = document.createElement("button");
        let shoeFavoriteButton = document.createElement("button");

        shoePhoto.id = "shoePhoto";
        shoeName.id = "shoeName";
        shoeDetailsButton.id = "shoeDetailsButton";
        shoeFavoriteButton.id= "shoeFavoriteButton";

        containerShoe.classList.add("containerShoe");
        shoePhoto.src = shoe.photo;
        shoeName.textContent = shoe.name;
        shoeDetailsButton.textContent = "Details";
        shoeFavoriteButton.textContent = "Delete from favorites";
        shoeDetailsButton.addEventListener("click", () => {
            window.location.href = "shoe.html?id=" + shoe.id;
        });
        shoeFavoriteButton.addEventListener("click", () => {
            deleteFromFavorites(shoe.id);
        });

        containerShoe.appendChild(shoePhoto);
        containerShoe.appendChild(shoeName);
        containerShoe.appendChild(shoeDetailsButton);
        containerShoe.appendChild(shoeFavoriteButton);
        list.appendChild(containerShoe);
    }
}

loadFavoriteShoes();

async function deleteFromFavorites(id)
{
    const favoriteData = {
        "email": Email,
        "shoeId": id
    };
    const response = await fetch("http://localhost:8081/shoe/favorite/delete", {
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(favoriteData)
    });
    if (!response.ok) {
        console.log("eroare la sters de la favorite");
    }
    else
        console.log("sters cu succes")
}