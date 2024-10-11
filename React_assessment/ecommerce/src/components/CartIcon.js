import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Outlet } from 'react-router-dom';
const CartIcon = () => {
  const { cartItems,removeFromCart } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <>
    <div>
      <button onClick={toggleCart}>
        Cart ({cartItems.length})
      </button>
      {showCart && (
        <div style={{ position: 'absolute', right: '20px', top: '50px', border: '1px solid #ccc', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
          <h4>Your Cart</h4>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.title} - ${item.price}
                {<button onClick={()=>removeFromCart(item.id)}>Remove</button>}
              </li>
            ))}
          </ul>
          <p>Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
        </div>
      )}
    </div>
    <Outlet />
    </>
  );
};

export default CartIcon;
