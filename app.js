const express = require("express");
// Modules from database.js to add and read from our database.
const {
  addProduct,
  addProductCategory,
  getProducts,
  getProductByName,
  getProductById,
  getProductByCategoryId,
  updateProduct,
  deleteProduct,
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  addCategory,
  addManufacturer,
  getAllProducts,
  getOrderByCustomerId,
  getProductStats,
  getAllReviews,
  getReviewStats,
  addReview,
} = require("./database.js");
const app = express();

// Function to log server requests
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// A built in Express function to decipher JSON requests.
app.use(express.json());
app.use(logger);

app.listen("3000", () => {
  console.log("Connection open on port 3000..");
});

// Get all products
app.get("/products", (req, res) => {
  res.json(getProducts());
});

// Search for a product with their name
app.get("/products/search", (req, res) => {
  if (!req.query.name || req.query.name === "") {
    res.status(404).send("Please enter a valid search query.");
  } else {
    let name = req.query.name;
    res.status(200).json(getProductByName(name));
  }
});

// Search for a product by product id
app.get("/products/:id", (req, res) => {
  if (req.params.id) {
    let p = getProductById(req.params.id);
    res.json(p);
  } else {
    res.status(404).send("Invalid id or no id found.");
  }
});

// Search for product stats by category id
app.get("/products/stats/:id", (req, res) => {
  if (req.params.id) {
    let p = getProductStats(req.params.id);
    res.status(200).json(p);
  } else {
    res.status(404).send("Invalid id or no id found.");
  }
});

// Search for product category by category id (1-7)
app.get("/products/category/:id", (req, res) => {
  if (req.params.id) {
    let p = getProductByCategoryId(req.params.id);
    res.status(200).json(p);
  } else {
    res.status(404).send("Invalid id or no id found.");
  }
});

// Search for product stats by product id
app.get("/reviews/stats/:id", (req, res) => {
  if (req.params.id) {
    let r = getReviewStats(req.params.id);
    res.status(200).json(r);
  } else {
    res.status(404).send("Invalid id or no id found.");
  }
});

app.get("/reviews", (req, res) => {
  res.status(200).json(getAllReviews());
});

app.post("/reviews", (req, res) => {
  const { product_id, customer_id, rating, comment } = req.body;
  res.status(200).json(addReview(product_id, customer_id, rating, comment));
});

// Add a new product by sending a request body
app.post("/products", (req, res) => {
  const { manufacturer_id, name, description, price, stock } = req.body;
  res
    .status(201)
    .json(addProduct(manufacturer_id, name, description, price, stock));
});

// Update existing product
app.put("/products/:id", (req, res) => {
  let name = req.query.name;
  let description = req.query.description;
  let price = req.query.price;
  let stock_quantity = req.query.stock;
  let product_id = req.params.id;
  res
    .status(201)
    .json(updateProduct(name, description, price, stock_quantity, product_id));
});

// Delete existing product
app.delete("/products", (req, res) => {
  res.send(deleteProduct(req.query.id));
});

// Get customers and their orders
app.get("/customers", (req, res) => {
  res.send(getCustomers());
});

// Add a new customer
app.post("/customers", (req, res) => {
  const { name, email, phone, address, password } = req.body;
  res.status(201).json(addCustomer(name, email, phone, address, password));
});

// Get customer by customer id
app.get("/customers/:id", (req, res) => {
  if (req.params.id) {
    let c = getCustomerById(req.params.id);
    res.status(200).json(c);
  } else {
    res.send("Invalid customer number");
  }
});

// Show orders for customers by customer id
app.get("/customers/:id/orders", (req, res) => {
  if (req.params.id) {
    let c = getOrderByCustomerId(req.params.id);
    res.status(200).json(c);
  } else {
    res.status(404).send("Invalid customer number");
  }
});

// Update existing customer
app.put("/customers/:id", (req, res) => {
  let email = req.query.email;
  let phone = req.query.phone;
  let address = req.query.address;
  let id = req.params.id;
  res.status(201).json(updateCustomer(email, phone, address, id));
});
