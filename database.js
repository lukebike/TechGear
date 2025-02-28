const Database = require("better-sqlite3");
const db = new Database("TechGearWebShop.db", { verbose: console.log });

function initializeDatabase() {
  const admins = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS admins (admin_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL)"
    )
    .run();
  const categories = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)"
    )
    .run();
  const customers = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS customers (customer_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT, address TEXT, password TEXT NOT NULL)"
    )
    .run();
  const manufacturers = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS manufacturers (manufacturer_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)"
    )
    .run();
  const orders = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS orders (order_id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL, order_date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (customer_id) REFERENCES customers(customer_id))"
    )
    .run();
  const products = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS products (product_id INTEGER PRIMARY KEY AUTOINCREMENT, manufacturer_id INTEGER, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, stock_quantity INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(manufacturer_id)) ON DELETE CASCADE ON UPDATE CASCADE"
    )
    .run();
  const productsCategories = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS products_categories (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, category_id INTEGER NOT NULL, FOREIGN KEY(product_id) REFERENCES products(product_id), FOREIGN KEY (category_id) REFERENCES categories(category_id)) ON DELETE CASCADE ON UPDATE CASCADE"
    )
    .run();
  const reviews = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS reviews (review_id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, customer_id INTEGER NOT NULL, rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), comment TEXT, FOREIGN KEY (product_id) REFERENCES products(product_id), FOREIGN KEY (customer_id) REFERENCES customers(customer_id)) ON DELETE CASCADE ON UPDATE CASCADE"
    )
    .run();
  const ordersProducts = db
    .prepare(
      "CREATE TABLE IF NOT EXISTS orders_products (order_product_id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, unit_price REAL NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (product_id) REFERENCES products(product_id))"
    )
    .run();
}
// initializeDatabase();

function addManufacturer(name) {
  try {
    const stmt = db.prepare("INSERT INTO manufacturers (name) VALUES (?)");
    return stmt.run(name);
  } catch (err) {
    console.error(`Failed to add manufacturer ${err}`);
  }
}

function getAllProducts() {
  const stmt = db.prepare("SELECT * from products");
  return stmt.all();
}

// addManufacturer("Google");
// addManufacturer("Samsung");
// addManufacturer("Apple");

function addProduct(manufacturer_id, name, description, price, stock_quantity) {
  try {
    const stmt = db.prepare(
      "INSERT INTO products (manufacturer_id, name, description, price, stock_quantity) VALUES (?,?,?,?,?) "
    );
    return stmt.run(manufacturer_id, name, description, price, stock_quantity);
  } catch (err) {
    console.error(err);
  }
}

function addCustomer(name, email, phone, address, password) {
  try {
    const stmt = db.prepare(
      "INSERT INTO customers (name, email, phone, address, password) VALUES (?,?,?,?,?)"
    );
    return stmt.run(name, email, phone, address, password);
  } catch (err) {
    console.error(err);
  }
}

function addCategory(name) {
  try {
    const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
    return stmt.run(name);
  } catch (err) {
    console.error(err);
  }
}

function addProductCategory(product_id, category_id) {
  try {
    const stmt = db.prepare(
      "INSERT INTO products_categories (product_id, category_id) VALUES (?, ?)"
    );
    return stmt.run(product_id, category_id);
  } catch (err) {
    console.error(err);
  }
}

function getProducts() {
  try {
    const stmt = db.prepare(
      "SELECT manufacturers.name AS manufacturer, products.product_id AS id, products.name, products.description, categories.name AS category, products.price, products.stock_quantity from products LEFT JOIN manufacturers ON products.manufacturer_id = manufacturers.manufacturer_id LEFT JOIN products_categories ON products.product_id = products_categories.product_id LEFT JOIN categories on products_categories.category_id = categories.category_id"
    );
    return stmt.all();
  } catch (err) {
    console.error(err);
  }
  // const stmt = db.prepare("SELECT * FROM products");
}
function getProductById(id) {
  try {
    const stmt = db.prepare(
      "SELECT products.product_id AS id, manufacturers.name AS manufacturer, products.name, products.description, categories.name AS category, products.price, products.stock_quantity from products LEFT JOIN manufacturers ON products.manufacturer_id = manufacturers.manufacturer_id LEFT JOIN products_categories ON products.product_id = products_categories.product_id LEFT JOIN categories on products_categories.category_id = categories.category_id WHERE products.product_id = ?"
    );
    return stmt.get(BigInt(id));
  } catch (err) {
    console.error(err);
  }
}

function getProductByCategoryId(id) {
  try {
    const stmt = db.prepare(
      "SELECT categories.category_id, categories.name AS category, products.name, products.description, products.price, products.stock_quantity FROM categories JOIN products_categories ON products_categories.category_id = categories.category_id JOIN products ON products.product_id = products_categories.product_id WHERE categories.category_id = ?"
    );
    return stmt.all(BigInt(id));
  } catch (err) {
    console.error(err);
  }
}

function getCustomers() {
  try {
    const stmt = db.prepare("SELECT * FROM customers");
    return stmt.all();
  } catch (err) {
    console.error(err);
  }
}

function getProductByName(name) {
  try {
    const stmt = db.prepare("SELECT * FROM products WHERE name = ?");
    return stmt.get(name);
  } catch (err) {
    console.error(err);
  }
}

function getCustomerById(id) {
  try {
    const stmt = db.prepare(
      "SELECT customers.customer_id, customers.name, customers.email, customers.phone, customers.address, orders.order_id, orders.order_date from customers LEFT JOIN orders on orders.customer_id = customers.customer_id WHERE customers.customer_id = ?;"
    );
    return stmt.all(id);
  } catch (err) {
    console.error(err);
  }
}

function getProductStats(id) {
  try {
    const stmt = db.prepare(
      "SELECT categories.name AS category, COUNT(*) AS total_products, AVG(products.price) AS average_price FROM products LEFT JOIN manufacturers ON products.manufacturer_id = manufacturers.manufacturer_id LEFT JOIN products_categories ON products.product_id = products_categories.product_id LEFT JOIN categories on products_categories.category_id = categories.category_id WHERE categories.category_id = ?"
    );
    return stmt.all(id);
  } catch (err) {
    console.error(err);
  }
}

function getReviewStats(id) {
  try {
    const stmt = db.prepare(
      "SELECT reviews.review_id, products.product_id AS id, products.name AS product, customers.name AS customer, reviews.rating, reviews.comment, AVG(reviews.rating) AS average_rating from reviews LEFT JOIN products ON products.product_id = reviews.product_id LEFT JOIN customers ON customers.customer_id = reviews.customer_id WHERE products.product_id = ?"
    );
    return stmt.all(id);
  } catch (err) {
    console.error(err);
  }
}

function getOrderByCustomerId(id) {
  try {
  } catch (err) {
    console.error(err);
  }
  const stmt = db.prepare(
    "SELECT customers.customer_id, customers.name, customers.email, customers.phone, customers.address, orders.order_id, products.name AS product, products.price, orders.order_date from customers JOIN orders on orders.customer_id = customers.customer_id JOIN orders_products ON orders.order_id = orders_products.order_id JOIN products ON products.product_id = orders_products.order_product_id WHERE customers.customer_id = ?"
  );
  return stmt.all(id);
}
function updateProduct(name, description, price, stock_quantity, product_id) {
  try {
    const stmt = db.prepare(
      "UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ? WHERE product_id = ?"
    );
    return stmt.run(name, description, price, stock_quantity, product_id);
    // console.log(`user updated: ${info.changes}`);
  } catch (err) {
    console.error("failed to update user:", err);
  }
}

function updateCustomer(email, phone, address, customer_id) {
  try {
    const stmt = db.prepare(
      "UPDATE customers SET email = ?, phone = ?, address = ? WHERE customer_id = ?"
    );
    return stmt.run(email, phone, address, customer_id);
  } catch (err) {
    console.error("failed to update customer:", err);
  }
}

function getAllReviews() {
  try {
    const stmt = db.prepare("SELECT * FROM reviews");
    return stmt.all();
  } catch (err) {
    console.error("Failed to get reviews", err);
  }
}

function addReview(product_id, customer_id, rating, comment) {
  try {
    const stmt = db.prepare(
      "INSERT INTO reviews (product_id, customer_id, rating, comment) VALUES (?,?,?,?);"
    );
    return stmt.run(product_id, customer_id, rating, comment);
  } catch (err) {
    console.error("Failed to add review", err);
  }
}

function deleteProduct(id) {
  try {
  } catch (err) {
    console.error(err);
  }
  const stmt = db.prepare("DELETE FROM products WHERE product_id = ?");
  return stmt.run(id);
}

module.exports = {
  addProduct,
  addProductCategory,
  getProducts,
  getProductByName,
  getProductById,
  getProductByCategoryId,
  getProductStats,
  getAllReviews,
  getAllProducts,
  getReviewStats,
  addReview,
  updateProduct,
  deleteProduct,
  addCustomer,
  getCustomers,
  getCustomerById,
  getOrderByCustomerId,
  updateCustomer,
  addCategory,
  addManufacturer,
};

// getProductByName("Google Pixel 60");

// addProduct("1", "Google Pixel 6", "AMOLED, 90Hz, HDR10+", "5000", "10");

// getProductById(2);

// addCustomer(
//   "Dale",
//   "dalerto@gmail.com",
//   "070707390",
//   "Guam Street 20",
//   "Dale1234"
// );

// addCustomer(
//   "Christina",
//   "christinaguilero@hotmail.com",
//   "0490030021",
//   "United Kingdom Riverside 90",
//   "chr1sTin404"
// );

// addCustomer(
//   "Albert",
//   "albertochino@icloud.se",
//   "0747727510",
//   "Germany Cologne Farm",
//   "4lb3rTCl0uD"
// );

// addCategory("Phones");

// addProductCategory(10, 1);
