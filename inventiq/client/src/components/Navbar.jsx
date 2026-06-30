import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom">
            <div className="container py-2">
                <Link className="navbar-brand fw-bold fs-4 text-primary me-4" to="/">
                    <span className="me-2">📦</span>
                    InventIQ
                </Link>

                <div className="navbar-nav flex-row flex-wrap align-items-center justify-content-center mx-auto gap-2 gap-lg-3">
                    <Link className="nav-link text-dark fw-semibold" to="/">
                        Dashboard
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/products">
                        Products
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/transactions">
                        Transactions
                    </Link>
                    <Link className="nav-link text-dark fw-semibold" to="/add-product">
                        Add Product
                    </Link>
                </div>

                <button className="btn btn-outline-danger btn-sm px-3" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;