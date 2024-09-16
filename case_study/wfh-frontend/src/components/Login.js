
import React, { useState, useContext } from 'react';
// import AuthContext from './AuthContext';
import axios from 'axios';
import {jwtDecode }from 'jwt-decode';

const Login = () => {
    // const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);

    
    const loginUser = async (userData) => {
        try {
            const response = await axios.post('/api/login/', {
                username: userData.username,
                password: userData.password
            });
            
            // Store the JWT token in local storage or state
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            console.log('User logged in successfully');
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { username, password };
        await loginUser(userData);
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
