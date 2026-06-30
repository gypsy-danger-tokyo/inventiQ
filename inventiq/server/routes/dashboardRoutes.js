const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getTotalProducts,
    getTotalTransactions,
    getRecentTransactions,
    getLowStockCount,
    getCategoryStats
    }=
    require("../controllers/dashboardController");
router.get("/total-products", authMiddleware, getTotalProducts);
router.get("/total-transactions", authMiddleware, getTotalTransactions);
router.get("/recent-transactions", authMiddleware, getRecentTransactions);
router.get("/low-stock-count", authMiddleware, getLowStockCount);
router.get("/category-stats", authMiddleware, getCategoryStats);
module.exports = router;