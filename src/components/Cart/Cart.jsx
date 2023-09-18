import React,{ useState,useContext } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Card.module.css'
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = (props) => {
  const [isCheckout,setisCheckout]=useState(false);
  const [isSubmitting,setisSubmitting]=useState(false);
  const [didSubmit,setdidSubmit]=useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({...item,amount:1})
  };

  const orderHandler=()=>{
    setisCheckout(true);
  }

  const submitOrderHandler=async (userData)=>{
    setisSubmitting(true);
    await fetch('https://react-http-efc85-default-rtdb.firebaseio.com/orders.json',{
      method:'POST',
      body:JSON.stringify({
        user:userData,
        orderedItems:cartCtx.items
      })
    });
    setisSubmitting(false);
    setdidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions=
  <div className={classes.actions}>
    <button className={classes['button--alt']} onClick={props.onClose}>
      Close
    </button>
    {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
  </div>

  const cartModalContent=
    <React.Fragment>
      {cartItems}
        <div className={classes.total}>
          <span>Total Amount</span>
          <span>{totalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
        {!isCheckout && modalActions}
    </React.Fragment>

  const isSubmittingModalContent=<p>Sending Order Data...</p>;
  
  const didsubmitModalContent=
  <React.Fragment>
    <p>Successfully sent the order!</p>
    <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
  </React.Fragment>

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didsubmitModalContent}
    </Modal>
  );
};

export default Cart;