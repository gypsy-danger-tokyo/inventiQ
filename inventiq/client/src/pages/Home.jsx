import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Tooltip, Legend } from "recharts";

const COLORS = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#20c997",
    "#fd7e14"
];

function Home() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [inventoryValue, setInventoryValue] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(true);
    const [categoryError, setCategoryError] = useState("");

    useEffect(() => {
        fetchDashboard();
        fetchCategoryStats();
    }, []);

    const fetchDashboard = async () => {
        try {
            const [productsRes, transactionsRes, inventoryRes, recentRes, lowStockRes] = await Promise.all([
                API.get("/dashboard/total-products"),
                API.get("/dashboard/total-transactions"),
                API.get("/products/total-value"),
                API.get("/dashboard/recent-transactions"),
                API.get("/dashboard/low-stock-count")
            ]);

            setTotalProducts(productsRes.data.count ?? 0);
            setTotalTransactions(transactionsRes.data.count ?? 0);
            setInventoryValue(inventoryRes.data.total ?? 0);
            setTransactions(recentRes.data.transactions ?? []);
            setLowStockCount(lowStockRes.data.count ?? 0);
        } catch (error) {
            console.error("Dashboard fetch failed:", error);
        }
    };

    const fetchCategoryStats = async () => {
        setCategoryLoading(true);
        setCategoryError("");

        try {
            const categoryRes = await API.get("/dashboard/category-stats");
            const stats = categoryRes.data?.stats ?? [];
            setCategoryStats(stats);
        } catch (error) {
            console.error("Category stats fetch failed:", error);
            setCategoryStats([]);
            setCategoryError("Could not load category chart. Please log in again.");
        } finally {
            setCategoryLoading(false);
        }
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value || 0);

    const getBadgeVariant = (type) => {
        const normalized = `${type || ""}`.toLowerCase();
        if (normalized.includes("in")) return "success";
        if (normalized.includes("out")) return "warning";
        return "secondary";
    };

    return (
        <div className="bg-light min-vh-100">
            <Navbar />

            <div className="container py-4 py-md-5">
                <div className="row align-items-center mb-4">
                    <div className="col-lg-8">
                        <p className="text-primary fw-semibold mb-2">Inventory overview</p>
                        <h1 className="display-6 fw-bold mb-2">Welcome back to your control center</h1>
                        <p className="text-muted mb-0">
                            Monitor stock movement, storage value, and essential alerts from one polished dashboard.
                        </p>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                            Live stock insights
                        </span>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="text-muted mb-1">Total products</p>
                                        <h2 className="fw-bold mb-0">{totalProducts}</h2>
                                    </div>
                                    <span className="badge bg-primary-subtle text-primary fs-6">📦</span>
                                </div>
                                <p className="text-muted small mb-0">Tracked SKUs in your inventory</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="text-muted mb-1">Transactions</p>
                                        <h2 className="fw-bold mb-0">{totalTransactions}</h2>
                                    </div>
                                    <span className="badge bg-success-subtle text-success fs-6">📑</span>
                                </div>
                                <p className="text-muted small mb-0">Movement events recorded</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <p className="text-muted mb-1">Inventory value</p>
                                        <h2 className="fw-bold mb-0">{formatCurrency(inventoryValue)}</h2>
                                    </div>
                                    <span className="badge bg-warning-subtle text-warning fs-6">💰</span>
                                </div>
                                <p className="text-muted small mb-0">Current stock valuation</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="card-title mb-1">Recent transactions</h5>
                                        <p className="text-muted small mb-0">Latest stock activity across your products</p>
                                    </div>
                                    <span className="badge bg-primary-subtle text-primary">Updated</span>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-0">No recent transactions yet.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Type</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((t) => (
                                                    <tr key={t._id}>
                                                        <td>{t.product?.name || "Unnamed product"}</td>
                                                        <td>
                                                            <span className={`badge text-bg-${getBadgeVariant(t.type)}`}>
                                                                {t.type}
                                                            </span>
                                                        </td>
                                                        <td>{t.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="card-title mb-1">Stock by category</h5>
                                        <p className="text-muted small mb-0">Distribution across your catalog</p>
                                    </div>
                                    <span className="badge bg-secondary-subtle text-secondary">Chart</span>
                                </div>

                                {categoryLoading && (
                                    <div className="text-center py-5 text-muted">Loading chart...</div>
                                )}

                                {!categoryLoading && categoryError && (
                                    <div className="text-center py-5 text-danger">{categoryError}</div>
                                )}

                                {!categoryLoading && !categoryError && categoryStats.length === 0 && (
                                    <div className="text-center py-5 text-muted">No products found to display.</div>
                                )}

                                {!categoryLoading && !categoryError && categoryStats.length > 0 && (
                                    <div className="d-flex justify-content-center">
                                        <PieChart
                                            width={320}
                                            height={300}
                                            data={categoryStats.map((item, index) => ({
                                                ...item,
                                                fill: COLORS[index % COLORS.length]
                                            }))}
                                        >
                                            <Pie
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label={({ name, value }) => `${name}: ${value}`}
                                            />
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 mt-4">
                    <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h5 className="fw-bold mb-1">Low stock alerts</h5>
                            <p className="text-muted mb-0">You have {lowStockCount} product(s) that need attention.</p>
                        </div>
                        <span className="badge bg-danger-subtle text-danger px-3 py-2">Priority review</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
