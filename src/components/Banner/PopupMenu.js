// src/components/PopupMenu.js
import React from 'react';
import '../../assets/css/PopupMenu.css';

function PopupMenu({ menuItems, addToOrder, closeMenuPopup }) {
  return (
    <div className="popup">
      <h2>Chọn Món Ăn</h2>
      <div className="menu">
        {menuItems.map(item => (
          <div className="menu-item" key={item.name} onClick={() => addToOrder(item.name, item.price, item.type)}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button className="close-btn" onClick={closeMenuPopup}>X</button>
    </div>
  );
}

export default PopupMenu;
