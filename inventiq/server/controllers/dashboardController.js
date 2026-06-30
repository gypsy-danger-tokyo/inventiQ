const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const getTotalProducts = async(req, res)=>{
    try{
        const count = await Product.countDocuments();
        res.status(200).json({
            success:true,
            count
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
const getTotalTransactions=async(req,res)=>{
    try{
        const count= await Transaction.countDocuments();
        res.status(200).json({
            success:true,
            count
        });
    }
    catch(error){
        res.status(500)
        .json({
            success:false,
            message:error.message
        });
    }
};
const getRecentTransactions=async(req, res)=>{
    try{
        const transactions=
        await Transaction
        .find()
        .populate("product")
        .sort({createdAt:-1}) //means newest to oldest
        .limit(5); //retunrs only latest 5
        res.status(200).json({
            success:true,
            transactions
        });
    }
    catch(error){
        res.status(500).json({
            success:false, 
            message:error.message
        });
    }
};
const getLowStockCount = async (req, res) => {
    try {
        const count = await Product.countDocuments({
            quantity: { $lt: 5 }
        });
        res.json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getCategoryStats = async (req, res) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports={
    getTotalProducts,
    getTotalTransactions,
    getRecentTransactions,
    getLowStockCount,
    getCategoryStats
};
