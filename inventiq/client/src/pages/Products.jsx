import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products?limit=100");
            setProducts(res.data.products);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) return;

        try {
            await api.delete(`/products/${id}`);
            alert("Product Deleted Successfully");
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete product");
        }
    };

    const stockIn = async (id) => {
        const quantity = prompt("Enter quantity to stock in:");

        if (!quantity) return;

        try {
            await api.post(`/products/stock-in/${id}`, {
                quantity: Number(quantity)
            });
            fetchProducts();
        } catch (error) {
            console.log(error);
        }
    };

    const stockOut = async (id) => {
        const quantity = prompt("Enter quantity to stock out:");

        if (!quantity) return;

        try {
            await api.post(`/products/stock-out/${id}`, {
                quantity: Number(quantity)
            });
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = category === "All" || product.category === category;
        return matchSearch && matchCategory;
    });

    const lastIndex = currentPage * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

    if (loading) {
        return (
            <div className="bg-light min-vh-100">
                <Navbar />
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-3 text-muted">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4 py-md-5">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                            <div>
                                <p className="text-primary fw-semibold mb-1">Inventory catalog</p>
                                <h2 className="fw-bold mb-0">Products</h2>
                            </div>
                            <button className="btn btn-primary px-4" onClick={() => navigate("/add-product")}>
                                + Add Product
                            </button>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <label className="form-label fw-semibold">Search</label>
                                <input
                                    className="form-control form-control-lg"
                                    placeholder="Search by product name"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Category</label>
                                <select
                                    className="form-select form-select-lg"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Stationery">Stationery</option>
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                <div className="text-center py-5">
                                                    <h6 className="fw-semibold mb-2">No products found</h6>
                                                    <p className="text-muted mb-0">Try a different search or add a new product.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentProducts.map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="fw-semibold">{product.name}</div>
                                                </td>
                                                <td>{product.category}</td>
                                                <td>
                                                    <span className="fw-semibold">{product.quantity}</span>
                                                    {product.quantity < 5 && (
                                                        <span className="badge bg-danger ms-2">Low stock</span>
                                                    )}
                                                </td>
                                                <td>₹{product.price}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => navigate(`/edit-product/${product._id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => deleteProduct(product._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={() => stockIn(product._id)}
                                                        >
                                                            Stock In
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-warning btn-sm"
                                                            onClick={() => stockOut(product._id)}
                                                        >
                                                            Stock Out
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                            <p className="text-muted mb-0">
                                Showing {filteredProducts.length === 0 ? 0 : firstIndex + 1}–{Math.min(lastIndex, filteredProducts.length)} of {filteredProducts.length} items
                            </p>
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-secondary"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    Previous
                                </button>
                                <button className="btn btn-outline-secondary disabled" type="button">
                                    Page {currentPage} of {totalPages}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;