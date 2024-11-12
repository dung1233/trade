// src/components/PopupBooking.js
import React from 'react';
import '../../assets/css/PopupBooking.css';

function PopupBooking({ closePopup, openMenuPopup }) {
  return (
    <div className="popup">
      <h2>Chọn Nhà Hàng</h2>
      <div className="store-list">
        <div className="store-item" onClick={openMenuPopup}>
          <img src="https://via.placeholder.com/50" alt="Store" />
          <div className="store-details">
            <div className="store-name">CHOPS - 4 Quảng An, Tây Hồ, Hà Nội</div>
            <div className="store-address">4 Quảng An, Tây Hồ, Hà Nội, Việt Nam</div>
            <div className="store-status open">Đang mở cửa</div>
          </div>
        </div>
        {/* Thêm các cửa hàng khác tương tự */}
      </div>
      <button className="close-btn" onClick={closePopup}>X</button>
    </div>
  );
}

export default PopupBooking;
