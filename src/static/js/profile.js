let profile = document.getElementById("containerProfile");
let edit = document.getElementById("containerProfileEdit");
let editPassword= document.getElementById("containerPasswordEdit")
const backButton = document.querySelector('.Button_Nav#back');

let photo = document.getElementById("Profile_Image");
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let username = document.getElementById("username");
let email = document.getElementById("email");
let dateOfBirth = document.getElementById("dateOfBirth");

let profileContainers = [profile, edit, editPassword];

function openProfileContainer(container) {
    for (let i = 0; i < 3; i++)
        profileContainers[i].style.display = "none";
    profileContainers[container].style.display = "block";
    if(container === 0)
    {
        loadProfile();
        backButton.style.visibility = 'hidden';
    }
    else
        backButton.style.visibility = 'visible';
}

console.log(sessionStorage);
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

console.log(token);
decodedToken= decodeToken(token);
const Email = decodedToken.email;
console.log(Email);
loadProfile();

async function loadProfile() {
    const token = localStorage.getItem('token');
    console.log(Email);
    const response = await fetch("http://localhost:8081/profile/", {
        method: "POST",
        headers:{
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    console.log(data);
    firstName.innerHTML = "";
    lastName.innerHTML="";
    username.innerHTML = "";
    email.innerHTML = "";
    dateOfBirth.innerHTML = "";

    if (data.photo != null)
        photo.src = data.photo;
    else
        photo.src="../Images/Icons/LogIn.png";
    firstName.innerHTML = data.firstName;
    lastName.innerHTML=data.lastName;
    username.innerHTML = data.username;
    email.innerHTML = data.email;
    dateOfBirth.innerHTML = data.birth;
}


//needs endpoint
async function sendEditProfile() {
    const token = localStorage.getItem('token');
    let data = new FormData(document.getElementById("editForm"));
    const editProfileData = {
        "photo": data.get('PhotoURL'),
        "email": Email,
        "firstname": data.get('FirstName'),
        "lastname": data.get('LastName'),
        "username": data.get('Username'),
        "birth": data.get('DateOfBirth')
    };
    if ( !editProfileData.firstname || !editProfileData.lastname  || !editProfileData.username || !editProfileData.birth ) {
        console.log("One or more fields are null.");
    }
    else {
        console.log(editProfileData)
        const message = await fetch("http://localhost:8081/profileEdit/", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editProfileData)
        });
        if (!message.ok) {
            let errorMessage = '';
            if (message.status === 401) {
                errorMessage = 'Username already in use.';
            } else {
                errorMessage = `An error occurred: ${message.statusText}`;
            }
            console.log(errorMessage);
        }
    }
}


//needs endpoint
async function sendEditPassword() {
    const token = localStorage.getItem('token');
    let psw = new FormData(document.getElementById("editPass"));
    if (psw.get('NewPassword') !== psw.get('ConfirmPassword')) {
        console.log("Passwords do not match.");
    }
    const editPasswordData = {
        "email": Email,
        "oldPass": psw.get('OldPassword'),
        "newPass": psw.get('NewPassword')
    };
    const response = await fetch("http://localhost:8081/profilePassword/", {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editPasswordData)
    });
    if (!response.ok) {
        let errorMessage = '';
        if (response.status === 401) {
            errorMessage = 'Old password is incorrect.';
        } else {
            errorMessage = `An error occurred: ${response.statusText}`;
        }
        console.log(errorMessage);
    }
}


//needs endpoint
async function deleteProfile() {
    const token = localStorage.getItem('token');
    await fetch("http://localhost:8081/profileDelete/", {
        method: "DELETE",
        headers:{
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    window.location.href = 'index.html';
    sessionStorage.clear();
}
