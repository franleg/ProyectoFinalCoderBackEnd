const profileButton = document.getElementById("profile-button");
const profileContainer = document.getElementById("profile-container");
const profileBackground = document.getElementById("profile-background");
const closeProfile = document.getElementById("close-profile");
const cartButton = document.getElementById("cart-button");

profileButton.addEventListener('click', () => {
    profileContainer.classList.toggle("active");
    profileBackground.classList.toggle("active");
});

profileBackground.addEventListener('click', () => {
    profileContainer.classList.remove("active");
    profileBackground.classList.remove("active");
});

profileContainer.addEventListener('click', (event) => {
    event.stopPropagation();
});

cartButton.addEventListener('click', () => {
    window.location='../../cart';
})

