# p5-kanap
Javascript focused project
the goal was to get the website up and running using a local API

# Index page :

Loads the products from the API (script.js)

# Product page:

When a product is clicked, redirect to the a page dedicated to that product by loading its information with the ID in the url (product.js)
that same page is used to choose color and quantity and send a product to the cart

# Cart page:

Displays all the product choosen by the client, allows the client to change quantity and delete items (cart.js). that same page also has a form
that verifies the input before the client places his/her order. once the data are checked, they're sent to the API's right url, if the request fits the api
specifications(contact object and array of product id) the client his redirected to the final page: confirmation.

Confirmation: the page contains the orderId in it's url, we recover it and display it in the html. this orderId is not saved anywhere 
and his randomly generated by the API every time.

the code is made of function that can be re-used refactored for the most part.
there's comments every where to help understant it


Redhewlett
