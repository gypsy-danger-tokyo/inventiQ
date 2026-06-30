const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

const createProducts = async (req, res) => {
    try {
        const { name, quantity, price, category } = req.body;
        const product = await Product.create({
            name,
            quantity,
            price,
            category
        });
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {
    console.log(req.query);
    try {
        const search = req.query.search || "";
        const category = req.query.category || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const skip = (page-1)*limit; //basicially how many pages we are skipping to get the page where our req entry is at
        let query = {};
        if(search){
            query.name = {$regex:search, $options:"i"}; //options:i is to enable case insensitive key Key KEY all are same
        }
        if(category){
            query.category = category;
        }
        const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Product.countDocuments(query);
        res.status(200).json({
            success: true, 
            currentPage: page,
            totalPages: Math.ceil(total/limit),
            totalProducts:total,
            products
        });
    } 
        catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Product Deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLowStockProducts=async(req, res)=>{
    try{
        const products=await Product.find({
            quantity:{$lt:5} //means quantity strictly less than five(mongoDB operates like this)
        });
        res.status(200).json({
            success: true,
            products
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

const getProductByCategory = async (req, res) => {
    try{
        const category=req.params.category;
        const products=await Product.find({category});
        res.status(200).json({
            success:true,
            products
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

const getTotalInventoryValue = async (req, res) => {
    try {
        const products = await Product.find();
        let total = 0;
        for (const product of products) {
            total += product.quantity * product.price;
        }
        res.status(200).json({
            success: true,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const stockIn=async(req, res)=>{
    console.log("STOCK IN CALLED");

    console.log(req.body);
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"product not found"
            });
        }
        product.quantity+=req.body.quantity;
        await product.save();
        await Transaction.create({
            product: product._id,
            quantity: req.body.quantity,
            type: "IN"
        });
        res.status(200).json({
            success: true,
            product
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

const stockOut=async(req, res)=>{
    console.log("STOCK OUT CALLED");
    console.log(req.body);
    try{
        const product = await Product.findById(
            req.params.id
        );
        console.log(product.quantity);
        if(!product){
            return res.status(404).json({
                success: false, 
                message:"Product not found"
            });
        }
        if(product.quantity < req.body.quantity){
            return res.status(400).json({
                success: false,
                message: "Insufficient Stock"
            });
        }
        product.quantity-=req.body.quantity;
        await product.save();
        await Transaction.create({
            product: product._id,
            quantity: req.body.quantity,
            type: "OUT"
        });
        res.status(202).json({
            success:true,
            product
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}
module.exports = {
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
};
