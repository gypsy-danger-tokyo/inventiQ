const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getTransactions };
