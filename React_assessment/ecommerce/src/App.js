import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
// import CartIcon from './components/CartIcon';
function App() {
  return (
    <>
      {/* <CartIcon /> */}
      <Outlet />
    </>
  );
}

export default App;
