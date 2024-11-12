import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import './test.css';

const personOptions = [
  { value: 1, label: 6 },
  { value: 2, label: 8 },
  { value: 3, label: 10 },
];
export default function Test() {
  const [filteredItems, setFilteredItems] = useState([]);  // Menu đã lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(JSON.parse(localStorage.getItem("menuSelect")) || {}); // Trạng thái lưu size được chọn

  const [orderList, setOrderList] = useState({});
  const [total, setTotal] = useState(0);
  const [isPopupVisible, setPopupVisible] = useState(false); // Điều khiển việc hiển thị popup

  const scrollContainerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectPerson, setSelectPerson] = useState(null);
  const [formName, setFormName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [person, setPerson] = useState('');
  const [addressOptions, setAddressOptions] = useState([]); // Store restaurant options

  // Fetch restaurant data from the API
  useEffect(() => {
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(' https://t2305mpk320241031161932.azurewebsites.net/api/Restaurant');
            const restaurantOptions = response.data.map(restaurant => ({
                value: restaurant.restaurantId, // Use restaurant_id as value
                label: restaurant.restaurantName, // Use restaurant name as label
            }));
            setAddressOptions(restaurantOptions);
        } catch (error) {
            console.error('Error fetching restaurant options:', error);
        }
    };

    fetchRestaurants();
}, []);

  useEffect(() => {
    // Gọi API để lấy danh sách món ăn
    axios.get('https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/with-variants')
      .then(response => {
        setMenuItems(response.data);
        setFilteredItems(response.data); // Hiển thị toàn bộ món ăn ban đầu
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu menu:", error);
      });
  }, []);

  // Save reservation data to localStorage
  const saveReservation = () => {
    const reservationData = {
        formName,
        email,
        phone,
        selectedAddress: selectedAddress ? selectedAddress.value : '', // Store restaurant_id
        selectedDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        selectedTime,
        person,
        selectPerson: selectPerson?.label || '',
    };
    localStorage.setItem('reservation', JSON.stringify(reservationData));
};

// Restore data from localStorage on mount
useEffect(() => {
    const savedReservation = localStorage.getItem('reservation');
    if (savedReservation) {
        const reservationData = JSON.parse(savedReservation);
        setFormName(reservationData.formName);
        setEmail(reservationData.email);
        setPhone(reservationData.phone);
        setSelectedAddress(addressOptions.find(option => option.value === reservationData.selectedAddress) || null);
        setSelectedDate(reservationData.selectedDate ? new Date(reservationData.selectedDate) : null);
        setSelectedTime(reservationData.selectedTime);
        setPerson(reservationData.person);
        setSelectPerson(personOptions.find(option => option.label === reservationData.selectPerson) || null);
    }
}, [addressOptions]);
 // Trigger saveReservation on form data change
 useEffect(() => {
  saveReservation();
}, [formName, email, phone, selectedAddress, selectedDate, selectedTime, person, selectPerson]);

const isValidDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

  const handleTimeChange = (event) => {
    const selectedTimeValue = event.target.value;
    const selectedDateTime = new Date(selectedDate);
    const currentTime = new Date();

    if (
        selectedDate &&
        selectedDate.getDate() === currentTime.getDate() &&
        selectedDate.getMonth() === currentTime.getMonth() &&
        selectedDate.getFullYear() === currentTime.getFullYear()
    ) {
        const [selectedHour, selectedMinute] = selectedTimeValue.split(':').map(Number);

        if (
            (selectedHour > currentTime.getHours() ||
            (selectedHour === currentTime.getHours() && selectedMinute >= currentTime.getMinutes())) &&
            selectedHour < 23
        ) {
            setSelectedTime(selectedTimeValue);
        } else {
            alert('Chọn thời gian từ giờ hiện tại đến 23:00.');
            setSelectedTime('');
        }
    } else {
        const [selectedHour] = selectedTimeValue.split(':').map(Number);

        if (selectedHour >= 7 && selectedHour < 23) {
            setSelectedTime(selectedTimeValue);
        } else {
            alert('Thời gian chỉ trong khoảng từ 07:00 đến 23:00.');
            setSelectedTime('');
        }
    }
  };

  const handleMouseDown = (e) => {
    setIsDown(true);
    const scrollContainer = scrollContainerRef.current;
    setStartX(e.pageX - scrollContainer.offsetLeft);
    setScrollLeft(scrollContainer.scrollLeft);
    scrollContainer.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    setIsDown(false);
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const scrollContainer = scrollContainerRef.current;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;  // Số 3 có thể điều chỉnh tùy ý
    scrollContainer.scrollLeft = scrollLeft - walk; // Lấy giá trị scrollLeft hiện tại và di chuyển nó
  };

  const handleTouchStart = (e) => {
    setIsDown(true);
    const scrollContainer = scrollContainerRef.current;
    const touch = e.touches[0];
    setStartX(touch.pageX - scrollContainer.offsetLeft);
    setScrollLeft(scrollContainer.scrollLeft);
    scrollContainer.style.cursor = 'grabbing';
  };

  const handleTouchEnd = () => {
    setIsDown(false);
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.style.cursor = 'grab';
  };

  const handleTouchMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const scrollContainer = scrollContainerRef.current;
    const touch = e.touches[0];
    const x = touch.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 3;
    scrollContainer.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    // Mouse events
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);

    // Touch events for mobile devices
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    scrollContainer.addEventListener('touchmove', handleTouchMove);

    // Clean up event listeners when component is unmounted
    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);

      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDown, startX, scrollLeft]);

  // Hàm để lọc các món ăn theo categoryId
  const filterMenu = (categoryId) => {
    const filtered = categoryId ? menuItems.filter(item => item.categoryId === categoryId) : menuItems;
    setFilteredItems(filtered);
  };

  // Hàm xử lý khi chọn size
  const handleSizeSelect = (menuItemNo, variant, item) => {
    setSelectedSizes(prevSizes => {
      let newSizes = { ...prevSizes };
  
      // Kiểm tra nếu size đã chọn, bỏ chọn nó nếu nhấn lại
      if (prevSizes[menuItemNo]?.variantId === variant.variantId) {
        delete newSizes[menuItemNo];
      } else {
        // Ngược lại, cập nhật size mới và thêm thời gian thêm vào
        newSizes[menuItemNo] = {
          ...variant,
          category: item.categoryId,
          imageURL: item.imageURL,
          itemName: item.itemName,
          addedAt: new Date().toISOString(), // Lưu thời gian món được thêm vào
        };
      }
  
      // Cập nhật lại localStorage
      if (Object.keys(newSizes).length === 0) {
        localStorage.removeItem("menuSelect");
      } else {
        localStorage.setItem("menuSelect", JSON.stringify(newSizes));
      }
  
      return newSizes;
    });
  };

  // Hàm xử lý khi chọn hoặc bỏ chọn món ăn
const handleItemClick = (menuItemNo, itemVariants, item) => {
  const firstVariant = itemVariants[0];
  setSelectedSizes(prevSizes => {
    const newSizes = { ...prevSizes };

    // Nếu món ăn đã được chọn, bỏ chọn món ăn đó
    if (newSizes[menuItemNo]?.variantId === firstVariant.variantId) {
      delete newSizes[menuItemNo];
    } else {
      newSizes[menuItemNo] = {
        ...firstVariant,
        imageURL: item.imageURL,
        itemName: item.itemName,
      };
    }

    // Cập nhật localStorage sau khi thay đổi
    if (Object.keys(newSizes).length === 0) {
      localStorage.removeItem("menuSelect");
    } else {
      localStorage.setItem("menuSelect", JSON.stringify(newSizes));
    }

    return newSizes;
  });
};

  // Hàm tìm kiếm món ăn theo tên
  const searchMenu = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredItems(menuItems); // Hiển thị toàn bộ món ăn nếu không có query
    } else {
      const filtered = menuItems.filter(item => item.itemName.toLowerCase().includes(query));
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    const savedSelection = JSON.parse(localStorage.getItem("menuSelect")) || {};
    setSelectedSizes(savedSelection);

    const menuSelect = JSON.parse(localStorage.getItem("menuSelect")) || {};

    const categorizedItems = {
      1: { name: "Starters", items: [] },
      2: { name: "Main Dishes", items: [] },
      3: { name: "Deserts", items: [] },
      4: { name: "Drinks", items: [] },
    };

    Object.keys(menuSelect).forEach((key) => {
      const item = menuSelect[key];
      const categoryId = item.categoryId;

      if (categorizedItems[categoryId]) {
        categorizedItems[categoryId].items.push(item);
      }
    });
  
    // Chuyển đổi dữ liệu từ savedSelection thành orderList với thứ tự theo thời gian thêm vào
    const formattedOrderList = {};
  
    // Lọc và sắp xếp các món ăn theo thời gian `addedAt`
    Object.keys(savedSelection).forEach(menuItemNo => {
      const item = savedSelection[menuItemNo];
      const type = item.itemName;
  
      if (!formattedOrderList[type]) {
        formattedOrderList[type] = [];
      }
  
      formattedOrderList[type].push({
        category: item.categoryId,
        name: item.itemName,
        size: item.sizeId,
        price: item.price,
        addedAt: item.addedAt, // Lưu thời gian thêm vào để sắp xếp
      });
    });
  
    // Sắp xếp các món ăn theo thời gian thêm vào
    Object.keys(formattedOrderList).forEach(type => {
      formattedOrderList[type] = formattedOrderList[type].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    });
  
    setOrderList(formattedOrderList);
  
    // Tính tổng giá trị đơn hàng
    const totalAmount = Object.values(savedSelection).reduce((sum, item) => sum + item.price, 0);
    setTotal(totalAmount);
  }, []);

  useEffect(() => {
    if (Object.keys(selectedSizes).length > 0) {
      const updatedOrderList = {};
      let updatedTotal = 0;
  
      // Định dạng lại orderList từ selectedSizes
      Object.keys(selectedSizes).forEach(menuItemNo => {
        const item = selectedSizes[menuItemNo];
        const type = item.itemName;
  
        if (!updatedOrderList[type]) {
          updatedOrderList[type] = [];
        }
  
        updatedOrderList[type].push({
          name: item.itemName,
          size: item.sizeId,
          price: item.price,
        });
  
        updatedTotal += item.price;
      });
  
      setOrderList(updatedOrderList);
      setTotal(updatedTotal);
  
      // Lưu lại vào localStorage
      localStorage.setItem("menuSelect", JSON.stringify(selectedSizes));
    } else {
      setOrderList({});
      setTotal(0);
      localStorage.removeItem("menuSelect");
    }
  }, [selectedSizes]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage và xử lý để đưa vào orderList
    const storedOrder = JSON.parse(localStorage.getItem("menuSelect")) || {};
    const formattedOrderList = {};

    // Định dạng dữ liệu từ storedOrder để dễ hiển thị
    Object.keys(storedOrder).forEach(menuItemNo => {
      const item = storedOrder[menuItemNo];
      const type = item.itemName;

      if (!formattedOrderList[type]) {
        formattedOrderList[type] = [];
      }

      formattedOrderList[type].push({
        name: item.itemName,
        size: item.sizeId,
        price: item.price
      });
    });

    setOrderList(formattedOrderList);

    // Tính tổng giá trị đơn hàng
    const totalAmount = Object.values(storedOrder).reduce((sum, item) => sum + item.price, 0);
    setTotal(totalAmount);
  }, []);

  // Hàm xoá món khỏi order
const removeFromOrder = (type, index) => {
  const updatedOrderList = { ...orderList };
  const removedItem = updatedOrderList[type][index];

  // Xoá món trong order
  updatedOrderList[type].splice(index, 1);
  if (updatedOrderList[type].length === 0) {
    delete updatedOrderList[type];
  }

  setOrderList(updatedOrderList);

  // Cập nhật lại selectedSizes sau khi xoá món
  setSelectedSizes(prevSizes => {
    const newSizes = { ...prevSizes };
    // Loại bỏ món bị xoá khỏi selectedSizes
    Object.keys(newSizes).forEach(key => {
      const item = newSizes[key];
      if (item.itemName === removedItem.name && item.sizeId === removedItem.size) {
        delete newSizes[key];
      }
    });

    if (Object.keys(newSizes).length === 0) {
      localStorage.removeItem("menuSelect");
    } else {
      localStorage.setItem("menuSelect", JSON.stringify(newSizes));
    }

    return newSizes;
  });

  // Cập nhật tổng giá trị đơn hàng
  setTotal(prevTotal => prevTotal - removedItem.price);
};
  // useEffect(() => {
  //   generateDates();
  // }, []);

  
  

  return (
    <div className="test-page container">
      <button className="button" onClick={openPopupBooking}>Đặt Nhà Hàng</button>

      <div id="overlay" className="overlay" onClick={closeAllPopups}></div>

      <div id="popup-booking" className="popup row" style={{ width: '80%' }}>
        <div className="col-lg-8 col-sm-7 col-xs-12" style={{ height: '100%' }}>
          {/* Input tìm kiếm */}
          <input
            type="text"
            id="searchInput"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onInput={searchMenu}
            style={{ width: '100%', margin: '10px 0' }}
          />
          <div className="menu row">
            {filteredItems.length === 0 ? (
              <p>No items found</p>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.menuItemNo}
                  className={`menu-item col-lg-3 col-md-4 col-sm-6 col-xs-12 ${selectedSizes[item.menuItemNo] ? 'selected-border' : ''}`}
                  onClick={() => handleItemClick(item.menuItemNo, item.itemVariants, item)}
                >
                  <div className="image-container">
                    <img src={item.imageURL} alt={item.itemName} />
                    <div className="price-badge">
                      {`$${selectedSizes[item.menuItemNo]?.price || item.price}`}
                    </div>
                  </div>
                  <p>{item.itemName}</p>

                  <div className="size-buttons">
                    {item.itemVariants.map(variant => (
                      <button
                        key={variant.variantId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeSelect(item.menuItemNo, variant, item);
                        }}
                        className={`size-button ${selectedSizes[item.menuItemNo]?.variantId === variant.variantId ? "active-size" : ""}`}
                      >
                        {variant.sizeId}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="top" ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}>
              <button className="select" onClick={() => filterMenu(null)}>All</button>
              <button className="select" onClick={() => filterMenu(1)}>Starters</button>
              <button className="select" onClick={() => filterMenu(2)}>Main Dishes</button>
              <button className="select" onClick={() => filterMenu(3)}>Deserts</button>
              <button className="select" onClick={() => filterMenu(4)}>Drinks</button>
            </div>
        </div>

        <div className="order col-lg-4 col-sm-5 col-xs-12">
          <h2>Current Order</h2>
          <div className="order-list" style={{ width: "100%" }}>
            {[1, 2, 3, 4].map(category => (
              <div key={category} style={{ marginBottom: '20px' }}>
                  <h3 style={{fontWeight: "bold"}}>
                      {category === 1 ? 'STARTERS' : category === 2 ? 'MAIN DISHES' : category === 3 ? 'DESERTS' : 'DRINKS'}
                  </h3>
                  {Object.keys(orderList).map((type) => (
                    <div key={type}>
                      {/* <h3>{`${type}:`}</h3> */}
                      {orderList[type].map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                          <h3 style={{width: "70%", paddingTop: "2px", paddingBottom: "0"}}>{`${item.name} (Size: ${item.size})`}</h3>
                          <span style={{width: "20%", fontSize: "16px"}}>{`$${item.price.toFixed(2)}`}</span>
                          <button style={{width: "10%", padding: "0 5px 5px 5px"}} onClick={() => removeFromOrder(type, index)}>X</button>
                        </div>
                      ))}
                    </div>
                  ))}                                       
              </div>
            ))}
          </div>
          <div className="total-section">
            <p>{`Total: $${total.toFixed(2)}`}</p>
            <button className="confirm-order" onClick={openAdditionPopup} style={{ marginRight: "5%" }}>
              CONFIRM
            </button>
            <button className="cancel-order">CANCEL</button>
          </div>
        </div>

      </div>

      <div id="popup-addition" className="popup row" style={{ width: '80%' }}>
        <h2 style={{ textAlign: 'center' }}>Chọn Dịch Vụ Bổ Sung</h2>
          <div style={{ padding: '20px' }}>
            <label><input type="checkbox" value="MC chương trình" /> MC chương trình</label><br />
            <label><input type="checkbox" value="Bánh gato" /> Bánh gato</label><br />
            <label><input type="checkbox" value="Âm nhạc" /> Âm nhạc</label><br />
            <label><input type="checkbox" value="Đồ dùng cao cấp" /> Đồ dùng cao cấp</label><br />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={openInfoPopup} style={{ padding: '10px 20px', backgroundColor: '#f39b1cd4', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Confirm</button>
          </div>
      </div>

      <div id="popup-info" className="popup row" style={{ width: '80%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chọn Nhà Hàng</h2>
        <div className="store-list col-lg-6">
          <a className="store-link"> {/* onClick={confirmBookinga} */}
            <div className="store-item">
              <div className="store-info">
                <img src="https://via.placeholder.com/50" alt="Store image" />
                <div className="store-details">
                  <div className="store-name">CHOPS - 4 Quảng An, Tây Hồ, Hà Nội</div>
                  <div className="store-address">4 Quảng An, Tây Hồ, Hà Nội, Việt Nam</div>
                </div>
              </div>
              <div className="store-status open">Đang mở cửa</div>
            </div>
          </a>
        </div>

        <div id="reservation" className="reservations-main pad-top-100 pad-bottom-100 col-lg-6" data-aos="fade-up">
          <div className="container">
              <div className="row">
                  <div className="form-reservations-box">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          {/* <div className="wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
                              <h2 className="block-title text-center">Reservations</h2>
                          </div> */}
                          <h4 className="form-title">BOOKING FORM</h4>
                          <p>PLEASE FILL OUT ALL REQUIRED* FIELDS. THANKS!</p>

                          <form id="contact-form" method="post" className="reservations-box" name="contactform" action="mail.php">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <input type="text" name="form_name" id="form_name" placeholder="Name" required="required" value={formName} onChange={(e) => setFormName(e.target.value)} />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <input type="email" name="email" id="email" placeholder="E-Mail ID" required="required" value={email} onChange={(e) => setEmail(e.target.value)} />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <input type="text" name="phone" id="phone" placeholder="Contact no." value={phone} onChange={(e) => setPhone(e.target.value)} />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <Select
                                          name="no_of_address"
                                          options={addressOptions}
                                          placeholder="Restaurant"
                                          value={selectedAddress}
                                          onChange={setSelectedAddress}
                                          isClearable
                                          isSearchable
                                      />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <DatePicker
                                          selected={selectedDate}
                                          onChange={(date) => setSelectedDate(date)}
                                          dateFormat="dd/MM/yyyy"
                                          placeholderText="Date"
                                          className="form-control"
                                          required
                                          filterDate={isValidDate}
                                          minDate={new Date()}
                                      />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <input
                                          type="time"
                                          value={selectedTime}
                                          onChange={handleTimeChange}
                                          required
                                          placeholder="Time"
                                          className="form-control"
                                      />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <input type="number" name="person" id="person" placeholder="Person no." value={person} onChange={(e) => setPerson(e.target.value)} />
                                  </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                  <div className="form-box">
                                      <Select
                                          name="No. person per table"
                                          options={personOptions}
                                          placeholder="No. person per table"
                                          value={selectPerson}
                                          onChange={setSelectPerson}
                                          isClearable
                                          isSearchable
                                      />
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
      {/* <div id="popup-confirm" className="popup row" style={{ width: '80%' }}>
        <button>3</button>
      </div> */}
    

      {/* <div id="popup-infor" className="popup">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Thông tin Đặt Nhà Hàng</h2>
        <div className="selection-boxes">
          <div id="home" className="selection-box active" onClick={() => selectType('home')}>
            <div className="icon">🏠</div>
            <strong>Bàn 6</strong>
            <p>Phù hợp cho gia đình</p>
          </div>
          <div id="office" className="selection-box" onClick={() => selectType('office')}>
            <div className="icon">🏢</div>
            <strong>Bàn 8</strong>
            <p>Phù hợp cho công ty</p>
          </div>
        </div>

        <div style={{ margin: '15px' }}>
          <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Chọn ngày</label>
          <div className="options" id="date-options"></div>
        </div>
        <div class="section">
          <div class="section-title">Chọn giờ :</div>
          <div class="options" id="time-options"
           className="scroll-container">
              <div class="option selected" onclick="selectOption(this, 'time')">10:00</div>
              <div class="option" onclick="selectOption(this, 'time')">12:00</div>
              <div class="option" onclick="selectOption(this, 'time')">14:00</div>
              <div class="option" onclick="selectOption(this, 'time')">16:00</div>
              <div class="option" onclick="selectOption(this, 'time')">18:00</div>
              <div class="option" onclick="selectOption(this, 'time')">20:00</div>
          </div>
        </div>
        <div style={{ margin: '15px' }}>
          <label htmlFor="tableCount" style={{ display: 'block', marginBottom: '5px' }}>Số Lượng Bàn:</label>
          <input type="number" id="tableCount" placeholder="Nhập số bàn" style={{ width: '95%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={confirmBooking} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Xác Nhận</button>
          <button onClick={closeAllPopups} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Hủy</button>
        </div>
      </div> */}

      {/* <div id="popup-menu" className="popup">
        <div className="top">
          <input type="text" id="searchInput" placeholder="Tìm kiếm món ăn..." onInput={searchMenu} />
          <button onClick={() => filterMenu('')}>Tất cả</button>
          <button onClick={() => filterMenu('Bữa chính')}>Bữa chính</button>
          <button onClick={() => filterMenu('Bữa phụ')}>Bữa phụ</button>
          <button onClick={() => filterMenu('Bữa tráng miệng')}>Bữa tráng miệng</button>
          <button onClick={() => filterMenu('Đồ uống')}>Đồ uống</button>
        </div>

        <div className="menu"></div>
        <div className="order">
          <h2>Current Order</h2>
          <div className="order-list">
            <p>Please select an item on the left to add to order</p>
          </div>
          <div className="total-section">
            <p>Total: $0.00</p>
            <button onClick={openConfirmPopup}>CONFIRM</button>
            <button onClick={closeAllPopups}>CANCEL</button>
          </div>
        </div>
      </div> */}

      {/* <div id="popup-confirm" className="popup">
        <button onClick={closeConfirmPopup}>X</button>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Xác Nhận Đơn Hàng</h2>
        <div id="order-details" className="order-list"></div>
        <div className="total-section">
          <p id="confirm-total"></p>
          <button onClick={finalizeOrder}>Xác Nhận Lần Cuối</button>
          <button onClick={closeConfirmPopup}>Hủy</button>
        </div>
      </div> */}

      
    </div>
  );
}

// Function Definitions
function confirmBookinga() {
  closeAllPopups();
  openMenuPopup();
}

function openPopupBooking() {
  document.getElementById("popup-booking").classList.add("show");
  document.getElementById("overlay").style.display = "block";
}

function closeAllPopups() {
  document.querySelectorAll('.popup').forEach(popup => popup.classList.remove("show"));
  document.getElementById("overlay").style.display = "none";
  document.getElementById("popup-addition").style.display = "none";
  document.getElementById("popup-info").style.display = "none";
  // document.getElementById("popup-confirm").style.display = "none";
}

function openMenuPopup() {
  document.getElementById("popup-menu").classList.add("show");
  document.getElementById("overlay").style.display = "block";
  // filterMenu('');
}




let orderList = {};
let total = 0;

function updateOrderList() {
  const orderListElement = document.querySelector(".order-list");
  const totalElement = document.querySelector(".total-section p");
  orderListElement.innerHTML = "";

  for (let type in orderList) {
    const typeTitle = document.createElement("h3");
    typeTitle.textContent = `${type}:`;
    orderListElement.appendChild(typeTitle);

    orderList[type].forEach((item, index) => {
      const orderItem = document.createElement("div");
      orderItem.style.display = "flex";
      orderItem.style.justifyContent = "space-between";

      const itemName = document.createElement("span");
      itemName.textContent = `${item.name} (Size: ${item.size})`;

      const itemPrice = document.createElement("span");
      itemPrice.textContent = `$${item.price.toFixed(2)}`;

      const removeButton = document.createElement("button");
      removeButton.textContent = "X";
      removeButton.onclick = () => removeFromOrder(type, index);

      orderItem.appendChild(itemName);
      orderItem.appendChild(itemPrice);
      orderItem.appendChild(removeButton);
      orderListElement.appendChild(orderItem);
    });
  }

  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromOrder(type, index) {
  const item = orderList[type][index];
  total -= item.price;

  orderList[type].splice(index, 1);
  if (orderList[type].length === 0) {
    delete orderList[type];
  }

  updateOrderList();
}

function openAdditionPopup() {
  document.getElementById("popup-addition").style.display = "block";
  document.getElementById("popup-booking").style.display = "none";
  document.getElementById("overlay").style.display = "block";
}
function openInfoPopup() {
  document.getElementById("popup-info").style.display = "block";
  document.getElementById("popup-addition").style.display = "none";
  document.getElementById("overlay").style.display = "block";
}
