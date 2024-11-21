import React, { useRef, useEffect, useState } from 'react';
import Typed from 'typed.js';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './test.css';


export default function Banner({ onClose }) {
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    if (el.current) {
      // Khởi tạo Typed.js
      typed.current = new Typed(el.current, {
        strings: [' Friends', ' Family', ' Officemates'],
        typeSpeed: 150,
        backSpeed: 150,
        loop: true,
      });
    }

    // Hủy Typed.js khi component bị tháo gỡ
    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, []);



  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  //popup 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupStep, setPopupStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  // const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);

  const [selectedMenuCategory, setSelectedMenuCategory] = useState(null); // Quản lý danh mục menu được chọn

  const handleMenuCategorySelect = (category) => {
    setSelectedMenuCategory(category); // Cập nhật danh mục menu
    setSelectedSubCategory(null); // Reset subCategory nếu có
  };
  const handleConfirm = () => {
    setIsConfirmationPopupOpen(true); // Mở popup mới
  };



  // Các mục con của Combo và danh sách món ăn trong từng mục
  const comboItems = [
    { id: 1, name: 'Combo A', items: [{ id: 'a1', name: 'Món A1', price: 15.0 }, { id: 'a2', name: 'Món A2', price: 15.0 }] },
    { id: 2, name: 'Combo B', items: [{ id: 'b1', name: 'Món B1', price: 7.0 }, { id: 'b2', name: 'Món B2', price: 8.0 }] },
  ];

  const sideItems = [
    { id: 3, name: 'Bữa phụ A', items: [{ id: 's1', name: 'Món S1', price: 2.0 }, { id: 's2', name: 'Món S2', price: 1.5 }] },
    { id: 4, name: 'Bữa phụ B', items: [{ id: 's3', name: 'Món S3', price: 1.0 }, { id: 's4', name: 'Món S4', price: 1.9 }] },
  ];
  // Các mục con của Combo

  const handleCategorySelect = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category); // Bỏ chọn nếu nhấn lại vào cùng nút
    setSelectedSubCategory(null); // Reset mục con khi chọn danh mục mới
  };

  // Hàm xử lý khi chọn mục con (ví dụ: Combo A)
  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };
  const [numTables, setNumTables] = useState(1); // Giá trị mặc định là 1
  const [numPeople, setNumPeople] = useState(50); // Giá trị mặc định là 50


  // Hàm xử lý khi chọn danh mục

  // Dữ liệu giả của các loại món ăn
  // const [error, setError] = useState('');

  const eventOptions = [
    {
      id: 1,
      title: 'Trang trí sự kiện',
      content: {
        text: 'Chúng tôi cung cấp dịch vụ trang trí sự kiện với các mẫu đa dạng và sáng tạo.',
        image: 'https://example.com/decor.jpg',
        options: [
          { id: 'decor1', label: 'Hoa tươi', image: 'https://example.com/flower.jpg' },
          { id: 'decor2', label: 'Đèn trang trí', image: 'https://example.com/lights.jpg' },
          { id: 'decor3', label: 'Backdrop', image: 'https://example.com/backdrop.jpg' },
        ],
      },
    },
    {
      id: 2,
      title: 'Dịch vụ âm nhạc',
      content: {
        text: 'Hãy để buổi tiệc của bạn trở nên sống động với dịch vụ âm nhạc chuyên nghiệp.',
        image: 'https://example.com/music.jpg',
        options: [
          { id: 'music1', label: 'Ban nhạc sống', image: 'https://example.com/band.jpg' },
          { id: 'music2', label: 'DJ', image: 'https://example.com/dj.jpg' },
          { id: 'music3', label: 'Hệ thống âm thanh', image: 'https://example.com/sound.jpg' },
        ],
      },
    },
  ]


  const [selectedOptions, setSelectedOptions] = useState([]);
  const toggleOption = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((optionId) => optionId !== id) : [...prev, id]
    );
  };
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };
  const [selectedServices, setSelectedServices] = useState({});
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setPopupStep(1); // Reset về bước đầu tiên khi đóng
  };
  const handleCheckboxChange = (categoryId, optionId) => {
    setSelectedServices((prev) => {
      const category = prev[categoryId] || [];
      if (category.includes(optionId)) {
        return { ...prev, [categoryId]: category.filter((id) => id !== optionId) };
      } else {
        return { ...prev, [categoryId]: [...category, optionId] };
      }
    });
  };


  const goToPreviousPopup = () => {
    setPopupStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };



  const selectDate = (date) => {
    setSelectedDate(date);
  };

  const selectTime = (time) => {
    setSelectedTime(time);
  };

  // const selectRestaurant = (restaurant) => {
  //   setSelectedRestaurant(restaurant);
  //   setPopupStep(3); // Chuyển đến popup 3 khi chọn nhà hàng
  // };
  const addItemToOrder = (item) => {
    setOrderItems([...orderItems, item]);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };
  //API món chính hay ph
  const menuCategories = {
    starters: [
      { id: 1, name: 'Salad', price: 5.0 },
      { id: 2, name: 'Soup', price: 4.0 },
    ],
    mainCourse: [
      { id: 3, name: 'Steak', price: 20.0 },
      { id: 4, name: 'Pasta', price: 15.0 },
    ],
    desserts: [
      { id: 5, name: 'Ice Cream', price: 6.0 },
      { id: 6, name: 'Cake', price: 7.0 },
    ],
    drinks: [
      { id: 7, name: 'Soda', price: 3.0 },
      { id: 8, name: 'Coffee', price: 4.0 },
    ],
  };
  const getPopupStyle = () => {
    switch (popupStep) {
      case 1:
        return {
          width: '80%',
          maxWidth: '800px',
          padding: '20px',
        };
      case 2:
        return {
          width: '80%',
          maxWidth: '800px',
          padding: '30px',
        };
      case 3:
        return {
          width: '80%',
          maxWidth: '1550px',
          padding: '40px',
        };
      default:
        return {
          width: '80%',
          maxWidth: '800px',
          padding: '30px',
        };
    }
  };
  const dates = ["20.11", "21.11", "22.11", "23.11", "24.11", "25.11", "26.11", "27.11", "28.11", "29.11"];
  const times = ["10:00", "14:00", "17:00", "19:00"];
  //code API

  // const restaurants = [
  //   {
  //     name: 'CHOPS - 4 Quảng An, Tây Hồ, Hà Nội',
  //     address: '4 Quảng An, Tây Hồ, Hà Nội, Việt Nam',
  //     status: 'Đang mở cửa',
  //     isOpen: true,
  //     image: 'https://th.bing.com/th/id/OIP.1Ghn67-qy9BrI5lH0PVZMwHaFx?rs=1&pid=ImgDetMain', // Thay thế bằng link hình ảnh thực tế
  //   },
  //   {
  //     name: 'CHOPS - 22 Mã Mây - Hoàn Kiếm - Hà Nội',
  //     address: '22 P. Mã Mây, Hàng Buồm, Hoàn Kiếm, Vietnam',
  //     status: 'Đang mở cửa',
  //     isOpen: true,
  //     image: 'https://ipos.vn/wp-content/uploads/2019/08/thiet-ke-nha-hang-5.jpg', // Thay thế bằng link hình ảnh thực tế
  //   },
  //   {
  //     name: 'CHOPS - 56 Phạm Huy Thông, Ba Đình, Hà Nội',
  //     address: '56 P. Phạm Huy Thông, Ngọc Khánh, Ba Đình, Hà Nội, Vietnam',
  //     status: 'Chưa mở cửa',
  //     isOpen: false,
  //     image: 'https://thietkehomexinh.com/wp-content/uploads/2017/03/nha-hang-ha-noi-01.jpg', // Thay thế bằng link hình ảnh thực tế
  //   },
  //   {
  //     name: 'CHOPS - 134 Giảng Võ, Đống Đa, Hà Nội',
  //     address: '134 P. Giảng Võ, Kim Mã, Đống Đa, Hà Nội, Việt Nam',
  //     status: 'Chưa mở cửa',
  //     isOpen: false,
  //     image: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-1.jpg', // Thay thế bằng link hình ảnh thực tế
  //   },
  // ];


  // API
  const [reservationDetails, setReservationDetails] = useState({
    table: null,
    date: null,
    time: null,
    numPeople: 50,
    numTables: 1,
    restaurant: null,
    selectedDishes: [],
    additionalItems: [],
  });

  // Hàm cập nhật thông tin
  const updateReservationDetails = (key, value) => {
    setReservationDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  // Popup Chọn ngày giờ
  // Hàm chọn bàn và tự tính số bàn
  const selectTable = (table) => {
    const numPeople = reservationDetails.numPeople || 0; // Lấy số người hiện tại
    const peoplePerTable = table === 6 ? 6 : 8;          // Số người mỗi bàn
    const numTables = Math.ceil(numPeople / peoplePerTable); // Tính số bàn

    updateReservationDetails('table', table);
    updateReservationDetails('numTables', numTables);
  };

  // Hàm xử lý khi thay đổi số người
  const handleNumPeopleChange = (value) => {
    const numPeople = Number(value) || 0;                 // Giá trị người dùng nhập
    const table = reservationDetails.table;              // Loại bàn hiện tại
    const peoplePerTable = table === 6 ? 6 : 8;          // Số người mỗi bàn
    const numTables = table ? Math.ceil(numPeople / peoplePerTable) : 1; // Tính số bàn nếu đã chọn loại bàn

    updateReservationDetails('numPeople', numPeople);
    if (table) updateReservationDetails('numTables', numTables); // Cập nhật số bàn nếu đã chọn bàn
  };

  // Hàm chuyển popup
  const goToNextPopup = () => {
    const { table, date, time, numPeople, restaurant } = reservationDetails;

    if (popupStep === 1) {
      // Kiểm tra thông tin bước 1
      if (!table || !date || !time) {
        alert('Vui lòng chọn đầy đủ thông tin: Bàn, Ngày và Giờ!');
        return;
      }

      if (numPeople < 50) {
        alert('Số lượng người phải lớn hơn hoặc bằng 50!');
        return;
      }
    }

    if (popupStep === 2) {
      // Kiểm tra xem người dùng đã chọn RestaurantId chưa
      if (!reservationDetails.restaurant) {
        alert('Vui lòng chọn nhà hàng trước khi tiếp tục!');
        return;
      }
    }
    console.log('Sending reservation details:', reservationDetails);
    setPopupStep((prevStep) => prevStep + 1); // Chuyển bước
  };
  // End chọn ngày giờ

  //Popup chọn nhà hàng
  const [restaurants, setRestaurants] = useState([]); // Dữ liệu nhà hàng
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Xử lý lỗi
  const [isFromAvailableApi, setIsFromAvailableApi] = useState(true); // Mặc định là từ API available

  // Hàm gọi API lấy danh sách nhà hàng
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API available
        const response = await axios.get(
          'https://t2305mpk320241031161932.azurewebsites.net/api/Restaurant/available'
        );
        if (response.data && response.data.length > 0) {
          setRestaurants(response.data); // Lưu danh sách nếu có dữ liệu
          setIsFromAvailableApi(true); // Đánh dấu dữ liệu lấy từ API available
        } else {
          // Nếu không có dữ liệu, gọi API reservations
          const fallbackResponse = await axios.get(
            'https://t2305mpk320241031161932.azurewebsites.net/api/Restaurant/reservations'
          );
          setRestaurants(fallbackResponse.data || []);
          setIsFromAvailableApi(false); // Đánh dấu dữ liệu lấy từ API reservations
        }
      } catch (err) {
        setError('Không thể tải danh sách nhà hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);
  // End nhà hàng
  // Popup chọn món
  const [menuItems, setMenuItems] = useState([]); // Lưu dữ liệu món ăn từ API
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Theo dõi loại món hiện tại

  // Hàm gọi API theo categoryId
  const fetchMenuItems = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/by-category/${categoryId}`
      );
      setMenuItems(response.data || []); // Cập nhật danh sách món ăn
      setSelectedCategoryId(categoryId); // Đánh dấu loại món hiện tại
    } catch (err) {
      setError('Không thể tải dữ liệu món ăn.');
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý chọn món ăn (mặc định chọn variant đầu tiên)
  const toggleDish = (dish) => {
    setReservationDetails((prev) => {
      const selectedDishes = [...prev.selectedDishes];
      const index = selectedDishes.findIndex((item) => item.menuItemNo === dish.menuItemNo);
  
      if (index >= 0) {
        // Nếu món đã có trong danh sách, bỏ chọn
        selectedDishes.splice(index, 1);
      } else {
        // Nếu chưa có, thêm món vào danh sách với variant mặc định
        const defaultVariant = dish.itemVariants[0]; // Lấy variant đầu tiên
        selectedDishes.push({
          ...dish,
          selectedVariant: defaultVariant.variantId, // Lưu variantId
          price: defaultVariant.price, // Lưu giá variant mặc định
        });
      }
  
      return { ...prev, selectedDishes };
    });
  };
  

  return (
    <div id="banner" className="banner full-screen-mode parallax">
      <div className="container pr">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="banner-static">
            <div className="banner-text">
              <div className="banner-cell">
                <h1>
                  Dinner with us{' '}
                  <span ref={el} style={{ color: "#e75b1e" }}></span>
                  <span className="cursor">_</span>
                </h1>
                <h2>Accidental appearances </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diem nonummy nibh euismod
                </p>
                <div style={{ position: 'relative' }}>
                  <button
                    style={{
                      padding: '10px 20px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      borderRadius: '5px',
                    }}
                    onClick={togglePopup}
                  >
                    Book my Table
                  </button>

                  {isPopupOpen && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                      }}
                      onClick={togglePopup}
                    >
                      <div
                        style={{
                          backgroundColor: 'white',
                          padding: '30px',
                          borderRadius: '10px',
                          ...getPopupStyle(),
                          position: 'relative',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {popupStep === 1 && (
                          <>
                            <h2>Online Catering</h2>
                            <p>Please fill in your details to reserve a table.</p>


                            {/* Các lựa chọn bàn */}
                            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                              <div
                                onClick={() => selectTable(6)}
                                style={{
                                  border: reservationDetails.table === 6 ? '2px solid #3b82f6' : '2px solid #e0e0e0',
                                  padding: '20px',
                                  borderRadius: '8px',
                                  textAlign: 'center',
                                  width: '365px',
                                  color: 'black',
                                  cursor: 'pointer',
                                  backgroundColor: reservationDetails.table === 6 ? '#e0f0ff' : 'white',
                                }}
                              >
                                <div style={{ fontSize: '30px' }}>🏠</div>
                                <strong>Bàn 6</strong>
                                <p>Phù hợp cho gia đình</p>
                              </div>

                              <div
                                onClick={() => selectTable(8)}
                                style={{
                                  border: reservationDetails.table === 8 ? '2px solid #3b82f6' : '2px solid #e0e0e0',
                                  padding: '20px',
                                  borderRadius: '8px',
                                  textAlign: 'center',
                                  width: '365px',
                                  color: 'black',
                                  cursor: 'pointer',
                                  backgroundColor: reservationDetails.table === 8 ? '#e0f0ff' : 'white',
                                }}
                              >
                                <div style={{ fontSize: '30px' }}>🏢</div>
                                <strong>Bàn 8</strong>
                                <p>Phù hợp cho công ty</p>
                              </div>
                            </div>

                            {/* Lựa chọn ngày */}
                            <div style={{ marginTop: '20px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>Chọn ngày:</div>
                              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {dates.map((date) => (
                                  <div
                                    key={date}
                                    onClick={() => updateReservationDetails('date', date)}
                                    style={{
                                      padding: '10px 20px',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: reservationDetails.date === date ? '2px solid #1e3a8a' : '1px solid #e0e0e0',
                                      backgroundColor: reservationDetails.date === date ? '#1e3a8a' : 'white',
                                      color: reservationDetails.date === date ? 'white' : 'black',
                                      fontWeight: reservationDetails.date === date ? 'bold' : 'normal',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minWidth: '60px',
                                      boxSizing: 'border-box',
                                    }}
                                  >
                                    {date} {reservationDetails.date === date && '✔️'}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Lựa chọn giờ */}
                            <div style={{ marginTop: '20px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>Chọn giờ:</div>
                              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {times.map((time) => (
                                  <div
                                    key={time}
                                    onClick={() => updateReservationDetails('time', time)}
                                    style={{
                                      padding: '10px 20px',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: reservationDetails.time === time ? '2px solid #1e3a8a' : '1px solid #e0e0e0',
                                      backgroundColor: reservationDetails.time === time ? '#1e3a8a' : 'white',
                                      color: reservationDetails.time === time ? 'white' : 'black',
                                      fontWeight: reservationDetails.time === time ? 'bold' : 'normal',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minWidth: '60px',
                                      boxSizing: 'border-box',
                                    }}
                                  >
                                    {time} {reservationDetails.time === time && '✔️'}
                                  </div>
                                ))}
                              </div>

                              <div style={{
                                marginTop: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '25px',
                                maxWidth: '200px',
                                margin: '0 auto',
                              }}>


                                {/* Phần Số người */}
                                <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                                  <label style={{ fontWeight: 'bold', color: '#333' }}>Số người:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={reservationDetails.numPeople}
                                    onChange={(e) => handleNumPeopleChange(e.target.value)}
                                    style={{
                                      padding: '8px',
                                      width: '80px',
                                      borderRadius: '5px',
                                      border: '1px solid #ccc',
                                      textAlign: 'center',
                                      backgroundColor: '#f9f9f9',
                                      fontSize: '14px',
                                      color: '#333',
                                    }}
                                  />
                                </div>
                                {/* Hiển thị số bàn */}
                                <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
                                  <label style={{ fontWeight: 'bold', color: '#333' }}>Số bàn:</label>
                                  <input
                                    type="number"
                                    value={reservationDetails.numTables}
                                    readOnly
                                    style={{
                                      padding: '8px',
                                      width: '80px',
                                      borderRadius: '5px',
                                      border: '1px solid #ccc',
                                      textAlign: 'center',
                                      backgroundColor: '#e9e9e9',
                                      fontSize: '14px',
                                      color: '#333',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                          </>
                        )}
                        {popupStep === 2 && (
                          <>
                            {/* Popup 2: Danh sách nhà hàng */}
                            <h2 style={{ textAlign: 'center', color: '#333' }}>Chọn Nhà Hàng</h2>
                            {loading && <p>Đang tải danh sách nhà hàng...</p>}
                            {error && <p>{error}</p>}
                            <div>
                              {restaurants.length > 0 ? (
                                restaurants.map((restaurant, index) => (
                                  <div
                                    key={index}
                                    onClick={() => updateReservationDetails('restaurant', restaurant.restaurantId)} // Lưu RestaurantId
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '10px',
                                      borderBottom: index < restaurants.length - 1 ? '1px solid #e0e0e0' : 'none',
                                      cursor: 'pointer',
                                      backgroundColor:
                                        reservationDetails.restaurant === restaurant.restaurantId ? '#e0f0ff' : 'white',
                                      border:
                                        reservationDetails.restaurant === restaurant.restaurantId
                                          ? '2px solid #3b82f6'
                                          : '1px solid #e0e0e0',
                                    }}
                                  >
                                    <img
                                      src={restaurant.imageURL || 'https://via.placeholder.com/100'}
                                      alt={restaurant.restaurantName}
                                      style={{ width: '100px', height: '100px', borderRadius: '5px' }}
                                    />
                                    <div style={{ marginLeft: '15px', flex: 1 }}>
                                      <h3 style={{ margin: '0', fontSize: '16px', color: '#333' }}>{restaurant.restaurantName}</h3>
                                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                        {restaurant.address}
                                      </p>
                                    </div>
                                    <span
                                      style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: isFromAvailableApi ? 'green' : 'red', // Xanh nếu từ available, đỏ nếu từ reservations
                                      }}
                                    >
                                      {isFromAvailableApi ? 'Mở cửa' : 'Đã hết chỗ'}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p>Không có nhà hàng khả dụng.</p>
                              )}
                            </div>
                          </>
                        )}

                        {popupStep === 3 && (
                          <>
                            {/* Popup 3: Chi tiết nhà hàng */}
                            <h2>Chọn Món Ăn</h2>

                            <div style={{ display: 'flex', height: '76vh', fontFamily: 'Arial, sans-serif', border: '1px solid #efd8d8' }}>
                              {/* Sidebar */}
                              <div
                                style={{
                                  backgroundColor: '#ffb74d',
                                  padding: '20px',
                                  width: '200px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Tìm kiếm món ăn..."
                                  style={{
                                    padding: '10px',
                                    width: '100%',
                                    borderRadius: '5px',
                                    fontFamily: 'inherit',
                                    color: 'black',
                                    border: '1px solid #ddd',
                                    marginBottom: '20px',
                                  }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '18px', color: 'black' }}>
                                  <button
                                    onClick={() => handleCategorySelect('combo')}
                                    style={{
                                      padding: '10px',
                                      fontSize: '16px',
                                      cursor: 'pointer',
                                      border: 'none',
                                      backgroundColor: 'rgb(255, 183, 77)',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    🍔
                                    <div>Combo</div>
                                  </button>

                                  {/* Hiển thị các mục con của Combo */}
                                  {selectedCategory === 'combo' && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                      {comboItems.map((item) => (
                                        <button
                                          key={item.id}
                                          onClick={() => handleSubCategorySelect(item)}
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          {item.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleCategorySelect('side')}
                                    style={{
                                      padding: '10px',
                                      fontSize: '16px',
                                      cursor: 'pointer',
                                      border: 'none',
                                      backgroundColor: 'rgb(255, 183, 77)',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    🍲
                                    <div>Bữa phụ</div>
                                  </button>

                                  {/* Hiển thị các mục con của Bữa phụ */}
                                  {selectedCategory === 'side' && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                      {sideItems.map((item) => (
                                        <button
                                          key={item.id}
                                          onClick={() => handleSubCategorySelect(item)}
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          {item.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  <button

                                    style={{
                                      padding: '10px',
                                      fontSize: '16px',
                                      cursor: 'pointer',
                                      border: 'none',
                                      backgroundColor: 'rgb(255, 183, 77)',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    🍲
                                    <div>
                                      Bữa tráng
                                    </div>
                                  </button>
                                </div>
                              </div>

                              {/* Menu */}
                              <div style={{ padding: '20px', width: '70%' }}>

                                {/* Các nút phân loại món ăn */}
                                {/* Các nút loại món */}
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-around' }}>
                                  <button
                                    onClick={() => fetchMenuItems(1)} // Starters
                                    style={{
                                      padding: '10px',
                                      backgroundColor: selectedCategoryId === 1 ? '#4CAF50' : '#ddd',
                                      color: selectedCategoryId === 1 ? 'white' : 'black',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: 'none',
                                    }}
                                  >
                                    Starters
                                  </button>
                                  <button
                                    onClick={() => fetchMenuItems(2)} // Main Course
                                    style={{
                                      padding: '10px',
                                      backgroundColor: selectedCategoryId === 2 ? '#4CAF50' : '#ddd',
                                      color: selectedCategoryId === 2 ? 'white' : 'black',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: 'none',
                                    }}
                                  >
                                    Main Course
                                  </button>
                                  <button
                                    onClick={() => fetchMenuItems(3)} // Desserts
                                    style={{
                                      padding: '10px',
                                      backgroundColor: selectedCategoryId === 3 ? '#4CAF50' : '#ddd',
                                      color: selectedCategoryId === 3 ? 'white' : 'black',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: 'none',
                                    }}
                                  >
                                    Desserts
                                  </button>
                                  <button
                                    onClick={() => fetchMenuItems(4)} // Drinks
                                    style={{
                                      padding: '10px',
                                      backgroundColor: selectedCategoryId === 4 ? '#4CAF50' : '#ddd',
                                      color: selectedCategoryId === 4 ? 'white' : 'black',
                                      borderRadius: '5px',
                                      cursor: 'pointer',
                                      border: 'none',
                                    }}
                                  >
                                    Drinks
                                  </button>
                                </div>

                                {/* Hiển thị trạng thái */}
                                {loading && <p>Đang tải dữ liệu...</p>}
                                {error && <p>{error}</p>}

                                {/* Hiển thị các món trong danh mục đã chọn */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', height: '90%', padding: '20px', backgroundColor: '#f5f5f5', }}>
                                  {menuItems.map((item) => (
                                    <div
                                      key={item.menuItemNo}
                                      onClick={() => toggleDish(item)}
                                      style={{
                                        width: '150px',
                                        height: '183px',
                                        border: reservationDetails.selectedDishes.some((dish) => dish.id === item.menuItemNo)
                                          ? '2px solid #4CAF50'
                                          : '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        backgroundColor: 'white',
                                        textAlign: 'center',
                                        color: 'black',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                                        <img
                                          src={item.imageURL || 'https://via.placeholder.com/100'}
                                          alt={item.itemName}
                                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                                        />
                                      </div>
                                      <div style={{ marginTop: '10px' }}>
                                        <strong>{item.itemName}</strong>
                                        <p>${item.itemVariants[0]?.price?.toFixed(2) || 'N/A'}</p>
                                      </div>
                                    </div>
                                  ))}

                                </div>
                              </div>

                              {/* Order Summary */}
                              <div
                                style={{
                                  width: '300px',
                                  padding: '20px',
                                  backgroundColor: 'white',
                                  borderLeft: '1px solid #ddd',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <h2 style={{ textAlign: 'center' }}>Current Order</h2>
                                <div
                                  style={{
                                    flexGrow: 1,
                                    border: '1px dashed #ddd',
                                    padding: '10px',
                                    marginBottom: '20px',
                                    color: 'black',
                                  }}
                                >
                                  {reservationDetails.selectedDishes.length > 0 ? (
                                    reservationDetails.selectedDishes.map((dish, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          marginBottom: '7px',
                                        }}
                                      >
                                       
                                          <h7>{dish.itemName}</h7>
                                          <div>
                                            Size:{' '}
                                            <select
                                              value={dish.selectedVariant} // Hiển thị variant hiện tại
                                              onChange={(e) => {
                                                const newVariantId = parseInt(e.target.value, 10); // Lấy variantId mới
                                                const newVariant = dish.itemVariants.find(
                                                  (variant) => variant.variantId === newVariantId
                                                );
                                                setReservationDetails((prev) => {
                                                  const updatedDishes = prev.selectedDishes.map((item) =>
                                                    item.menuItemNo === dish.menuItemNo
                                                      ? { ...item, selectedVariant: newVariantId, price: newVariant.price }
                                                      : item
                                                  );
                                                  return { ...prev, selectedDishes: updatedDishes };
                                                });
                                              }}
                                            >
                                              {dish.itemVariants.map((variant) => (
                                                <option key={variant.variantId} value={variant.variantId}>
                                                  {variant.sizeId}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                       
                                        <h7>${dish.price.toFixed(2)}</h7>
                                        <button
                                          onClick={() => toggleDish(dish)} // Xóa món
                                          style={{
                                            border: 'none',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '5px',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          Xóa
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <p style={{ textAlign: 'center', color: '#888' }}>Chưa chọn món nào</p>
                                  )}
                                </div>
                                <div style={{ fontWeight: 'bold', marginBottom: '20px', color: 'black' }}>
                                  Tổng: $
                                  {reservationDetails.selectedDishes
                                    .reduce((total, dish) => total + dish.price, 0)
                                    .toFixed(2)}
                                </div>
                                <button
                                  onClick={() => console.log('Order confirmed:', reservationDetails)}
                                  style={{
                                    padding: '10px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Xác nhận
                                </button>
                                {isConfirmationPopupOpen && (
                                  <div
                                    style={{
                                      position: 'fixed',
                                      top: 0,
                                      left: 0,
                                      width: '100vw',
                                      height: '100vh',
                                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 1000,
                                    }}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: 'white',
                                        padding: '40px',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                        textAlign: 'center',
                                        maxWidth: '600px',
                                        width: '90%',
                                      }}
                                    >
                                      <h2 style={{ fontSize: '24px', color: '#333' }}>Xác nhận đặt bàn</h2>
                                      <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
                                        Cảm ơn bạn đã đặt bàn. Vui lòng chọn thêm các dịch vụ nếu cần:
                                      </p>

                                      {/* Danh sách checkbox với hình ảnh */}
                                      <div style={{ textAlign: 'left', marginTop: '15px' }}>
                                        {eventOptions.map((option) => (
                                          <div
                                            key={option.id}
                                            style={{
                                              border: '1px solid #ddd',
                                              borderRadius: '8px',
                                              marginBottom: '10px',
                                              overflow: 'hidden',
                                            }}
                                          >
                                            <div
                                              style={{
                                                backgroundColor: '#f9f9f9',
                                                padding: '15px 20px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                              }}
                                              onClick={() => toggleAccordion(option.id)}
                                            >
                                              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{option.title}</span>
                                              <span style={{ fontSize: '20px', color: '#333' }}>
                                                {activeId === option.id ? '-' : '+'}
                                              </span>
                                            </div>

                                            {activeId === option.id && (
                                              <div
                                                style={{
                                                  padding: '20px',
                                                  backgroundColor: 'white',
                                                }}
                                              >
                                                <img
                                                  src={option.content.image}
                                                  alt={option.title}
                                                  style={{
                                                    width: '100%',
                                                    borderRadius: '8px',
                                                    marginBottom: '10px',
                                                    objectFit: 'cover',
                                                  }}
                                                />
                                                <p style={{ fontSize: '14px', color: '#555' }}>{option.content.text}</p>

                                                {/* Danh sách các tùy chọn */}
                                                {option.content.options.map((opt) => (
                                                  <div
                                                    key={opt.id}
                                                    style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      marginBottom: '10px',
                                                      gap: '10px',
                                                      border: '1px solid #ddd',
                                                      borderRadius: '8px',
                                                      padding: '10px',
                                                    }}
                                                  >
                                                    {/* Hình ảnh */}
                                                    <img
                                                      src={opt.image}
                                                      alt={opt.label}
                                                      style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '5px',
                                                        objectFit: 'cover',
                                                        border: '1px solid #ccc',
                                                      }}
                                                    />
                                                    {/* Checkbox và Nhãn */}
                                                    <div style={{ flex: 1 }}>
                                                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#333' }}>
                                                        <input
                                                          type="checkbox"
                                                          checked={(selectedServices[option.id] || []).includes(opt.id)}
                                                          onChange={() => handleCheckboxChange(option.id, opt.id)}
                                                          style={{ cursor: 'pointer' }}
                                                        />
                                                        {opt.label}
                                                      </label>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>

                                      {/* Nút Gửi yêu cầu */}
                                      <button
                                        onClick={() => {
                                          console.log('Các dịch vụ đã chọn:', selectedOptions); // Thực hiện lưu thông tin
                                          setIsConfirmationPopupOpen(false); // Đóng popup
                                        }}
                                        style={{
                                          marginTop: '20px',
                                          padding: '15px 30px',
                                          fontSize: '18px',
                                          backgroundColor: '#4CAF50',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '10px',
                                          cursor: 'pointer',
                                          transition: 'background-color 0.3s',
                                        }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                                      >
                                        Gửi yêu cầu
                                      </button>
                                    </div>
                                  </div>
                                )}



                              </div>
                            </div>


                          </>
                        )}

                        {/* Nút điều hướng */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                          {popupStep > 1 && (
                            <button
                              onClick={goToPreviousPopup}
                              style={{
                                fontSize: '36px',
                                color: 'black',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                              }}
                            >
                              &#8592; {/* Mũi tên trái */}
                            </button>
                          )}

                          {popupStep < 3 && (
                            <button
                              onClick={goToNextPopup}
                              style={{
                                fontSize: '36px',
                                color: 'black',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                              }}
                            >
                              &#8594; {/* Mũi tên phải */}
                            </button>
                          )}
                        </div>

                        <button
                          style={{
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                          }}
                          onClick={togglePopup}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <a href="#about">
                  <div className="mouse"></div>
                </a>
              </div>
              {/* <!-- end banner-cell --> */}
            </div>
            {/* <!-- end banner-text --> */}
          </div>
          {/* <!-- end banner-static --> */}
        </div>
        {/* <!-- end col --> */}
      </div>
      {/* <!-- end container --> */}
    </div >
    // <!-- end banner -->
  );
}
