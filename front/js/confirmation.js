//get the orderId from the url (same logic from product.js)
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

//send the orderId in the html
//selecting the html
const orderDisplay = document.getElementById("orderId");
orderDisplay.innerHTML = orderId;
