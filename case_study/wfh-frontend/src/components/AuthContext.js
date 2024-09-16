// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode }from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);

    const loginUser = async (username, password) => {
        const response = await axios.post('http://localhost:8000/api/login/', {
            username, password
        });
        if (response.data.access) {
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
        }
    };

    const registerUser = async (username, email, password) => {
        await axios.post('http://localhost:8000/api/register/', {
            username, email, password
        });
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
