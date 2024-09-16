// Signup.js
import React, { useState, useContext } from 'react';
// import AuthContext from './AuthContext';
import axios from 'axios';
const Signup = () => {
    // const { registerUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const registerUser = async (userData) => {
        try {
            const response = await axios.post('/api/register/', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Error during registration:', error.response.data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(username, email, password);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
