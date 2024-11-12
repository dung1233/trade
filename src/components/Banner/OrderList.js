// src/components/OrderList.js
import React from 'react';
import '../../assets/css/OrderList.css';

function OrderList({ orderList, total, setOrderList, setTotal }) {
  const removeFromOrder = (type, index) => {
    setOrderList(prevOrderList => {
      const updatedOrder = { ...prevOrderList };
      const itemPrice = updatedOrder[type][index].price;
      updatedOrder[type].splice(index, 1);
      if (updatedOrder[type].length === 0) delete updatedOrder[type];
      return updatedOrder;
    });
    setTotal(prevTotal => prevTotal - orderList[type][index].price);
  };

  return (
    <div className="order">
      <h2>Current Order</h2>
      <div className="order-list">
        {Object.keys(orderList).map(type => (
          <div key={type}>
            <h3>{type}</h3>
            {orderList[type].map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
                <button onClick={() => removeFromOrder(type, index)}>X</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="total-section">
        <p>Total: ${total.toFixed(2)}</p>
        <button className="confirm-btn" onClick={() => alert('Order confirmed!')}>CONFIRM</button>
      </div>
    </div>
  );
}

export default OrderList;
