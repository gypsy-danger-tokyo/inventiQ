import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", formData);
      alert("Product Added");

      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: ""
      });
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container py-4 py-md-5 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm rounded-4 w-100" style={{ maxWidth: "640px" }}>
          <div className="card-body p-4 p-md-5">
            <p className="text-primary fw-semibold mb-2">Create inventory entry</p>
            <h2 className="fw-bold mb-2">Add Product</h2>
            <p className="text-muted mb-4">Capture the essentials for a new item in your catalog.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Product name</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
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
                  placeholder="e.g. Electronics"
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
                  placeholder="0"
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
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <button className="btn btn-primary btn-lg w-100" type="submit">
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;