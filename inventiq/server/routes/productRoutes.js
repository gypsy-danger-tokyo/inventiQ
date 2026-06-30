const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();
const {
    createProducts,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getProductByCategory,
    getTotalInventoryValue,
    stockIn,
    stockOut
} = require("../controllers/productController");

router.post("/", authMiddleware, adminMiddleware, createProducts);
router.post("/stock-in/:id", authMiddleware, adminMiddleware, stockIn);
router.post("/stock-out/:id", authMiddleware, adminMiddleware, stockOut);
router.get("/", authMiddleware, getProducts);
router.get("/low-stock", authMiddleware, getLowStockProducts);
router.get("/total-value", authMiddleware, getTotalInventoryValue);
router.get("/category/:category", authMiddleware, getProductByCategory);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
