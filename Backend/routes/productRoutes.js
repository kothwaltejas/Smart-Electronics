const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct, // ✅ Add the update function
  deleteProduct, // ✅ Import the delete function
} = require('../controllers/productController');

// @route   POST /api/products
// @desc    Create a new product
router.post('/', createProduct);

// @route   GET /api/products
// @desc    Fetch all products
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Fetch product by ID
router.get('/:id', getProductById);

// ✅ NEW ROUTE
// @route   PUT /api/products/:id
// @desc    Update product by ID
router.put('/:id', updateProduct);

// ✅ NEW ROUTE
// @route   DELETE /api/products/:id
// @desc    Delete product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
