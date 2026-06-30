import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantity: "",
        price: ""
    });

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);

            setFormData({
                name: res.data.product.name,
                category: res.data.product.category,
                quantity: res.data.product.quantity,
                price: res.data.product.price
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/products/${id}`, formData);
            alert("Product Updated Successfully");
            navigate("/products");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4 py-md-5 d-flex align-items-center justify-content-center">
                <div className="card border-0 shadow-sm rounded-4 w-100" style={{ maxWidth: "640px" }}>
                    <div className="card-body p-4 p-md-5">
                        <p className="text-primary fw-semibold mb-2">Update inventory entry</p>
                        <h2 className="fw-bold mb-2">Edit Product</h2>
                        <p className="text-muted mb-4">Adjust the details for this product without changing any workflow.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Product name</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    name="name"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Category</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    name="category"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Quantity</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Price</label>
                                <input
                                    className="form-control form-control-lg"
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <button className="btn btn-primary btn-lg w-100" type="submit">
                                Update Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;