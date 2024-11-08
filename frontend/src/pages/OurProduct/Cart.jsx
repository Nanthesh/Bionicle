// Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrimarySearchAppBar from '../../components/Navbar.jsx';
import ActiveLastBreadcrumb from '../../components/Breadcrumb.jsx';

const Cart = () => {
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const cartProducts = products.filter((product) => cartItems[product.id] > 0);

  return (
    <div>
      <PrimarySearchAppBar />
      <ActiveLastBreadcrumb />
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <hr />
          {cartProducts.length > 0 ? (
            cartProducts.map((item) => (
              <div key={item.id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>${item.price * cartItems[item.id]}</p>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <div className="cart-bottom">
          <h2>Cart Total</h2>
          <button onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
