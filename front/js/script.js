//use fetch to get the models from the api
function getModels() {
  fetch("http://localhost:3000/api/products/")
    .then((response) => {
      if (!response.ok) {
        throw Error("error");
      }
      return response.json();
    })
    .then(function (data) {
      //use the couchDisplay function with the data from the api in parameters
      //console.log(data);
      couchDisplay(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

//dynamicaly displaying the products in the html
function couchDisplay(list) {
  const html = list
    .map((product) => {
      return `
        <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
    })
    .join("");
  document.getElementById("items").innerHTML = html;
}
//call the main function
getModels();
