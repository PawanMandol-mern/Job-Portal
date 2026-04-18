/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()

    const checkAuth = async () => {
        try {
        const res = await axios.get("http://localhost:3000/api/user/me", {
            withCredentials: true,
            timeout : 300
        });

            setUser(res.data.user);
            setIsAuthenticate(true);

        } catch (error) {
            setUser(null);
            setIsAuthenticate(false);
            console.log("Error in me", error);
        } finally {
        setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticate(true);
    };

    const logout = async () => {
        try {
        await axios.get("http://localhost:3000/api/user/logout", {
            withCredentials: true,
        });
        navigate('/')
        } catch (error) {
        console.log("Error in logout", error);
        }
        setUser(null);
        setIsAuthenticate(false);
    };

    useEffect(() => {
        console.log("CHECK AUTH CALLED");
        checkAuth();
    }, []);
    return (
        <AuthContext.Provider
        value={{ isAuthenticate, logout, user, loading, login }}
        >
        {children}
        </AuthContext.Provider>
    );
    };

    export const useAuth = () => {
    return useContext(AuthContext);
    };
