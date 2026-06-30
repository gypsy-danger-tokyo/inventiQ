import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/users/login", {
                email,
                password
            });

            login(res.data.user, res.data.token);
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center px-3">
            <div className="card border-0 shadow-sm rounded-4 w-100" style={{ maxWidth: "440px" }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mb-3" style={{ width: "56px", height: "56px" }}>
                            <span className="fs-4">🔐</span>
                        </div>
                        <h2 className="fw-bold mb-1">Welcome back</h2>
                        <p className="text-muted mb-0">Sign in to manage your inventory</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                                className="form-control form-control-lg"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Password</label>
                            <input
                                className="form-control form-control-lg"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary btn-lg w-100" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;