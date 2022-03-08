//same function from the previous js
function fetchProduct(productId) {
  return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw Error("error");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// fetch what's in the cart(reminder: cart is global to the website)
function fetchProductsInCart() {
  for (productKey in cart) {
    const chosenProduct = cart[productKey];
    //get the information of the chosen product to print color/quantity choice
    fetchProduct(chosenProduct.id).then((productInformation) => {
      insertProduct(productInformation, chosenProduct);
      itemPriceTotal(chosenProduct, productInformation);
    });
  }
}

//load what starts with prefix "product-" from the local storage in cart
//re-using the same function from product.js
function loadProductsFromLocalStorage(prefix) {
  window.cart = window.cart ?? {};

  for (key in localStorage) {
    if (key.startsWith(prefix)) {
      const product = JSON.parse(localStorage.getItem(key));

      window.cart[`${product.id}-${product.color}`] = product;
    }
  }
}
loadProductsFromLocalStorage("product-");
fetchProductsInCart();

//count total of items and total price of the cart
//using an array to store the price/nbr of items for later use
const prices = [];
const totalQuantity = [];

//total price and quantity function
function itemPriceTotal(chosenProduct, productInformation) {
  //we use a reducer to make the math
  const reducer = (accumulator, curr) => accumulator + curr;
  //for prices
  const eachLotPrice = productInformation.price * chosenProduct.quantity;
  prices.push(eachLotPrice);
  const totalPrice = prices.reduce(reducer);
  //for items
  totalQuantity.push(chosenProduct.quantity);
  const totalItems = totalQuantity.reduce(reducer);
  //display
  priceAndQuantityDisplay(totalItems, totalPrice);
}
//quantity and price displayer
function priceAndQuantityDisplay(totalItems, totalPrice) {
  const QuantityDisplay = (document.getElementById("totalQuantity").innerHTML = totalItems);
  const PriceDisplay = (document.getElementById("totalPrice").innerHTML = totalPrice);
}

//write html with product informations
function insertProduct(product, chosenProduct) {
  const quantity = chosenProduct.quantity;
  const cartHtml = `<article class="cart__item" data-id="${product._id}" data-color="${chosenProduct.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${chosenProduct.color}</p>
              <p>${product.price}€</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : ${quantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;
  const cartDisplay = (document.getElementById("cart__items").innerHTML += cartHtml);
  //for each product displayed get these functions ready
  modifyQuantity();
  deleteProduct();
}

//wait for the html to be loaded

//function

//cart modifications functions
const prefix = "product-";
//quantity modification
function modifyQuantity() {
  //Looping over all the products quantityBoxes and listen to change
  const quantityBoxes = document.querySelectorAll(".itemQuantity");
  quantityBoxes.forEach((box) => {
    box.addEventListener("change", function (e) {
      //selecting the P right next to the box
      const prevP = e.target.previousElementSibling;
      //selecting elements in the html to identify the porduct we have an event on
      const idProductToEdit = box.closest("article").getAttribute("data-id");
      const colorProductToEdit = box.closest("article").getAttribute("data-color");
      const productToEdit = idProductToEdit + "-" + colorProductToEdit;
      // writting the new value in the html
      prevP.innerText = "Qté : " + e.target.value;
      //edit the quantity inside the cart
      const existingProduct = cart[productToEdit];
      existingProduct.quantity = parseInt(e.target.value);
      //then write over that same product in localStorage using the prefix logic established in product.js
      localStorage.setItem(`${prefix}${productToEdit}`, JSON.stringify(cart[productToEdit]));
      // and refresh to update the price / quantity
      refresh(1000);
    });
  });
}

//delete an item
function deleteProduct() {
  //selecting the buttons
  const deleteButtons = document.querySelectorAll(".deleteItem");
  //loop over all the buttons and listen to click to trigget the removal of the target's item
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const idProductToDelete = button.closest("article").getAttribute("data-id");
      const colorProductDelete = button.closest("article").getAttribute("data-color");
      const productToDelete = idProductToDelete + "-" + colorProductDelete;
      //then delete that same product in localStorage using the prefix logic established in product.js
      localStorage.removeItem(`${prefix}${productToDelete}`);
      //remove from the html
      deleteHtml();
    });
  });
}

//remove from html function
function deleteHtml() {
  const htmlToDelete = document.querySelector(".cart__item");
  htmlToDelete.remove();
  //refresh to update the price / quantity
  refresh(200);
}
//refresh after given time
function refresh(time) {
  window.setTimeout(function () {
    window.location.reload();
  }, time);
}

//form data verification
//Input fields
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
//Error-message spaces in the html
const firstNameInvalid = document.getElementById("firstNameErrorMsg");
const lastNameInvalid = document.getElementById("lastNameErrorMsg");
const addressInvalid = document.getElementById("addressErrorMsg");
const cityInvalid = document.getElementById("cityErrorMsg");
const mailInvalid = document.getElementById("emailErrorMsg");

//check if all fields have been filed correctly
//regex validations
//firstName
const regFirstName = /^([^\s])([a-zA-ZÀ-ÿ ,.'-])+$/;
firstName.addEventListener("input", function verifyFirstName() {
  //if  the firstName doesn't fit the regex, alert in htlm
  if (!regFirstName.test(firstName.value)) {
    firstNameInvalid.innerHTML = "Prénom invalide";
  } else {
    firstNameInvalid.innerHTML = " ";
  }
});
//and lastName
const regName = /^([^\s])[a-zA-ZÀ-ÿ ,.'-]+$/;
lastName.addEventListener("input", function verifyLastName() {
  //if  the firstName doesn't fit the regex, alert in htlm
  if (!regName.test(lastName.value)) {
    lastNameInvalid.innerHTML = "Nom invalide";
  } else {
    lastNameInvalid.innerHTML = " ";
  }
});
// address
//address patterns can be complex, we're just going to exclud special characters
const regAddress = /^([^\s])([a-zA-ZÀ-ÿ 0-9,.'-])*$/;
address.addEventListener("input", function verifyAddress() {
  if (!regAddress.test(address.value)) {
    addressInvalid.innerHTML = "Entez une adresse valid (sans charactères spéciaux)";
  } else {
    addressInvalid.innerHTML = " ";
  }
});
//city +zip code
//check if starts with combination of string(excluding special caracters) and ends with 5digits max
const regCity = /^([a-zA-ZÀ-ÿ]*)[\s]*?[\-]?([a-zA-ZÀ-ÿ]*)[\s]?[\-]?([a-zA-ZÀ-ÿ]*)[\s]?[0-9]{5}$/;
city.addEventListener("input", function verifyCity() {
  if (!regCity.test(city.value)) {
    cityInvalid.innerHTML = "Veuillez saisir le nom de la ville PUIS le code postal";
  } else {
    cityInvalid.innerHTML = " ";
  }
});

//emails---
const regMail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
email.addEventListener("input", function verifyMail() {
  if (!regMail.test(email.value)) {
    mailInvalid.innerHTML = "Entrez un E-Mail valide!";
  } else {
    mailInvalid.innerHTML = " ";
  }
});

//Send the order
const formDiv = document.querySelector(".cart__order__form");
//if we have no error messages we can create the contact object
formDiv.addEventListener(
  "submit",
  function (event) {
    if (
      regFirstName.test(firstName.value) &&
      regName.test(lastName.value) &&
      regAddress.test(address.value) &&
      regCity.test(city.value) &&
      regMail.test(email.value)
    ) {
      event.preventDefault();
      //contact object for the api
      const form = {
        firstName: firstName.value.replace(/\s+/g, " ").trim(),
        lastName: lastName.value.replace(/\s+/g, " ").trim(),
        address: address.value.replace(/\s+/g, " ").trim(),
        city: city.value.replace(/\s+/g, " ").trim(),
        email: email.value.replace(/\s+/g, " ").trim(),
      };
      //the products we send with the request is an array of product _id
      const contact = {};
      const products = [];
      for (item in cart) {
        const chosenProduct = cart[item].id;
        products.push(chosenProduct);
      }
      //send the form to the contact object outside the function
      const sendToContact = Object.assign(contact, form);
      //order request

      //prep the objects waited by the api
      const requestBody = JSON.stringify({
        contact,
        products,
      });
      //requestOptions
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: requestBody,
      };
      order(requestOptions);
    } else {
      //prevent default, we only want to post when we're done checking the inputs
      event.preventDefault();
      console.log("fill the form with proper information first!!");
    }
  },
  false
);

//POST request
function order(requestOptions) {
  fetch("http://localhost:3000/api/products/order/", requestOptions)
    .then((response) => response.json())
    .then(function (response) {
      //get the unique orderId generated by the API
      const orderId = response.orderId;
      //redirect the client to the confirmation page with the orderId in the URL
      redirectToConfirmation(orderId);
    })
    .catch((error) => console.log("error", error));
}
//redirect function
function redirectToConfirmation(id) {
  window.location.replace(`./confirmation.html?id=${id}`);
}
