import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import CartProvider from './contexts/CartContext';
import CartIcon from './components/CartIcon';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<LoginPage />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='products' element={<CartIcon/>}>
        <Route path='home' element={<HomePage />} />
        <Route path='product/:id' element={<ProductDetailsPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />  
    </CartProvider>
  </React.StrictMode>
);
reportWebVitals();
