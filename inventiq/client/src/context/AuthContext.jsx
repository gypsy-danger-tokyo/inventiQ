import { createContext , useState, useEffect, Children } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const login = (userData, tokenData)=>{
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", tokenData);
    };
    const logout=()=>{
        setUser(null);
        setToken("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    return(
        <AuthContext.Provider
        value={{
            user, 
            token, 
            login, 
            logout
        }}> {children} </AuthContext.Provider>
    );
};