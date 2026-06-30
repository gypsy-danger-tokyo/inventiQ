import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions");
            setTransactions(res.data.transactions);
        } catch (error) {
            console.log(error);
        }
    };

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
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
                            <div>
                                <p className="text-primary fw-semibold mb-1">Activity log</p>
                                <h2 className="fw-bold mb-0">Transactions</h2>
                            </div>
                            <span className="badge bg-success-subtle text-success px-3 py-2">Recent movements</span>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="text-center py-5">
                                <h6 className="fw-semibold mb-2">No transactions yet</h6>
                                <p className="text-muted mb-0">Stock activity will appear here as products are updated.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Product</th>
                                            <th>Type</th>
                                            <th>Quantity</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td>{transaction.product?.name || "Unnamed product"}</td>
                                                <td>
                                                    <span className={`badge text-bg-${getBadgeVariant(transaction.type)}`}>
                                                        {transaction.type}
                                                    </span>
                                                </td>
                                                <td>{transaction.quantity}</td>
                                                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;