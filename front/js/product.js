// get the product informations by recovering his id in the url
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
//fetch function for a single product
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

//function display  product
function displayProduct(product) {
  document.querySelector(".item__img").innerHTML = ` 
      <img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.querySelector("#title").innerHTML = `${product.name}`;
  document.querySelector("#price").innerHTML = `${product.price}`;
  document.querySelector("#description").innerHTML = `${product.description}`;
  //loop through the array of colors for the product
  product.colors.forEach(function (item) {
    document.querySelector("#colors").innerHTML += `<option value="${item}">${item}</option>`;
  });
}

fetchProduct(productId).then(function (product) {
  displayProduct(product);
  //get the data once the client is done choossing and clicks the button
  const addToCart = document.getElementById("addToCart");
  addToCart.onclick = () => {
    const color = document.getElementById("colors").value;
    //parseInt to increment quantities later in the local storage
    const quantity = parseInt(document.getElementById("quantity").value);
    //if color and quantity have been set, we creat the client's choice (choosenProduct)
    if (color && quantity) {
      const choosenProduct = {
        id: productId,
        color,
        quantity,
      };
      //then we save it to the cart using the function saveProductToCart()
      saveProductToCart(choosenProduct);
      return;
    }
    //if not we alert
    alert("please choose color and quantity");
  };
});

//save to cart function
function saveProductToCart(choosenProduct) {
  //identify products in cart/localStorage
  const productKey = `${choosenProduct.id}-${choosenProduct.color}`;
  const existingProduct = cart[productKey];
  //if the product the client wants to add is similar to one present in the cart, we just increment
  if (existingProduct) {
    existingProduct.quantity += choosenProduct.quantity;
  } else {
    //else we set it in the cart
    cart[productKey] = choosenProduct;
  }
  //save it to the cart with the prefix
  saveCartToLocalStorage("product-");
}

//loading already existing choices in the cart to compare with the current choice before adding.
function loadProductsFromLocalStorage(prefix) {
  //check if the cart already exists. if not, initialise it
  //we make to cart global(with window) to access it from anywhere on the site withou recreating a variable on each js
  window.cart = window.cart ?? {};

  for (key in localStorage) {
    if (key.startsWith(prefix)) {
      const product = JSON.parse(localStorage.getItem(key));

      window.cart[`${product.id}-${product.color}`] = product;
    }
  }
}
//save product to localStorage using the prefix ( for later identification)
function saveCartToLocalStorage(prefix) {
  for (productKey in cart) {
    localStorage.setItem(`${prefix}${productKey}`, JSON.stringify(cart[productKey]));
  }
}

//using the prefix product to retrieve any product in the localStorage
loadProductsFromLocalStorage("product-");
