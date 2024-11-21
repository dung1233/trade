import React, { useRef, useEffect, useState } from 'react';
import Typed from 'typed.js';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './test.css';
import { useNavigate } from 'react-router-dom';

export default function Banner({ onClose }) {
  const el = useRef(null);
  const typed = useRef(null);
  const navigate = useNavigate(); // chuyển trang 
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




  // Các mục con của Combo và danh sách món ăn trong từng mục
  const comboItems = [
    { id: 1, name: 'Gà', items: [{ id: 'a1', name: 'Món A1', price: 15.0 }, { id: 'a2', name: 'Món A2', price: 15.0 }] },
    { id: 2, name: 'Bò', items: [{ id: 'b1', name: 'Món B1', price: 7.0 }, { id: 'b2', name: 'Món B2', price: 8.0 }] },
  ];

  const sideItems = [
    { id: 3, name: 'Cơm', items: [{ id: 's1', name: 'Món S1', price: 2.0 }, { id: 's2', name: 'Món S2', price: 1.5 }] },
    { id: 4, name: 'Cá', items: [{ id: 's3', name: 'Món S3', price: 1.0 }, { id: 's4', name: 'Món S4', price: 1.9 }] },
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
    customerName: '', // Thêm trường tên khách hàng
    customerPhone: '', // Thêm trường số điện thoại
    customerEmail: '', // Thêm trường email
    orderNote: '', // Thêm trường ghi chú nếu cần
    customerId: null, // Thêm customerId
  });
  // Lấy thông tin người dùng từ API khi có token
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios
        .get('https://t2305mpk320241031161932.azurewebsites.net/api/UserProfile/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userId = response.data.customerId; // Giả sử API trả về `id` cho customerId
          setReservationDetails((prevDetails) => ({
            ...prevDetails,
            customerId: userId, // Thêm customerId vào reservationDetails
          }));
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);


  // Hàm cập nhật thông tin
  const updateReservationDetails = (key, value) => {
    setReservationDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  // Popup Chọn ngày giờ
  const generateDates = () => {
    const today = new Date();
    const dates = [];

    // Bắt đầu từ 7 ngày sau
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 7);

    // Tạo 10 ngày tiếp theo, mỗi ngày cách nhau 1 ngày
    for (let i = 0; i < 10; i++) {
      const futureDate = new Date(startDate);
      futureDate.setDate(startDate.getDate() + i);

      // Định dạng ngày thành YYYY-MM-DD
      const year = futureDate.getFullYear();
      const month = (futureDate.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = futureDate.getDate().toString().padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  const dates = generateDates();
  console.log(dates);

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
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((restaurant) => restaurant.restaurantId === restaurantId);
    return restaurant ? restaurant.restaurantName : 'Unknown';
  };
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
      setSelectedType(null); // Xóa type khi chuyển sang tab khác
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
  //End chọn món

  //Popup chọn món thêm
  const [expandedCategory, setExpandedCategory] = useState(null); // Quản lý mục nào đang mở
  const [eventDecorations, setEventDecorations] = useState([]); // Dữ liệu Trang trí sự kiện
  const [musicServices, setMusicServices] = useState([]);
  const handleConfirm = () => {
    setIsConfirmationPopupOpen(true); // Mở popup mới
    console.log('After pick food done:', reservationDetails);
  };
  // Hàm toggle Accordion
  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  }
  // Hàm gọi API lấy dữ liệu món thêm
  const fetchAdditionalItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventResponse = await axios.get(
        `https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/by-category/5`
      );
      const musicResponse = await axios.get(
        `https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/by-category/6`
      );

      setEventDecorations(eventResponse.data || []);
      setMusicServices(musicResponse.data || []);
    } catch (err) {
      setError('Không thể tải dữ liệu món thêm.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchAdditionalItems khi bật popup
  useEffect(() => {
    if (isConfirmationPopupOpen) {
      fetchAdditionalItems();
    }
  }, [isConfirmationPopupOpen])
  // Hàm xử lý chọn/bỏ chọn món thêm
  const toggleAdditionalItem = (item) => {
    setReservationDetails((prev) => {
      const additionalItems = [...prev.additionalItems];
      const index = additionalItems.findIndex((selectedItem) => selectedItem.menuItemNo === item.menuItemNo);

      if (index >= 0) {
        // Nếu đã chọn, bỏ món
        additionalItems.splice(index, 1);
      } else {
        // Nếu chưa chọn, thêm vào danh sách với selectedVariant từ itemVariants
        additionalItems.push({
          ...item,
          selectedVariant: item.itemVariants[0]?.variantId || 0, // Lấy variantId mặc định
        });
      }

      return { ...prev, additionalItems };
    });
  };


  //End chọn thêm'

  //Màn hình Order
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);

  const calculateTotalCost = () => {
    const { selectedDishes, additionalItems, numPeople, numTables } = reservationDetails;

    let totalCost = 0;

    // Tính tiền món chính
    selectedDishes.forEach((dish) => {
      if (dish.categoryId === 4) {
        totalCost += dish.price * numTables; // Nhân với số người tham dự
      } else {
        totalCost += dish.price * numTables; // Nhân với số bàn
      }
    });

    // Tính tiền món thêm
    additionalItems.forEach((item) => {
      totalCost += item.price; // Cộng thẳng vào
    });

    return totalCost.toFixed(2);
  };


  // const totalCost = calculateTotalCost();
  const calculateDepositAmount = () => {
    const totalCost = parseFloat(calculateTotalCost());
    return (totalCost * 0.3).toFixed(2); // 30% của tổng tiền
  };

  const handleInputChange = (field, value) => {
    setReservationDetails((prev) => {
      const updatedDetails = { ...prev, [field]: value };
      console.log('Updated Field:', field, 'Value:', value, 'Updated Details:', updatedDetails); // Debug
      return updatedDetails;
    });
  };

  useEffect(() => {
    const eventDateTime = `${reservationDetails.date}T${reservationDetails.time}:00`; // Cập nhật ngày đúng
    console.log('Reservation time Updated:', eventDateTime);
    console.log('Reservation Details Updated:', reservationDetails);
  }, [reservationDetails]);

  //debug phòng trừ lỗi không nhận dữ liệu nhập
  const reservationDetailsRef = useRef(reservationDetails);

  useEffect(() => {
    reservationDetailsRef.current = reservationDetails;
  }, [reservationDetails]);

  const handleCheckout = async () => {
    // Lấy snapshot hiện tại của reservationDetails
    const currentReservationDetails = reservationDetailsRef.current;
    // const currentReservationDetails = { ...reservationDetails };

    // Kiểm tra dữ liệu trước khi gửi
    // if (
    //   !currentReservationDetails.customerName ||
    //   !currentReservationDetails.customerPhone ||
    //   !currentReservationDetails.customerEmail
    // ) {
    //   alert('Vui lòng nhập đầy đủ thông tin liên hệ!');
    //   return;
    // }

    console.log('Checkout Data:', currentReservationDetails); // Debug

    try {

      const eventDateTime = `${currentReservationDetails.date}T${currentReservationDetails.time}:00`; // Cập nhật ngày đúng


      const orderPayload = {
        customerId: currentReservationDetails.customerId !== undefined ? currentReservationDetails.customerId : null, // Đảm bảo 'customerId' hợp lệ
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: currentReservationDetails.date,
        name: currentReservationDetails.customerName,
        phone: currentReservationDetails.customerPhone,
        email: currentReservationDetails.customerEmail,
        eventTime: eventDateTime,
        restaurant_id: parseInt(currentReservationDetails.restaurant, 10) || 0,
        noOfPeople: currentReservationDetails.numPeople,
        noOfTable: currentReservationDetails.numTables,
        depositCost: parseFloat(calculateDepositAmount()),
        totalCost: parseFloat(calculateTotalCost()),
        orderNote: currentReservationDetails.orderNote || '',
        status: 'Pending',  // Lưu ý chính tả 'status'

      };


      console.log('Order Payload:', orderPayload);

      // Gửi API
      const orderResponse = await axios.post(
        ' https://t2305mpk320241031161932.azurewebsites.net/api/CustOrder',
        orderPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('API Response:', orderResponse.data);
      const orderId = orderResponse.data.orderId;
      console.log('Order ID:', orderId); // Debug
      // Gửi selectedDishes và additionalItems
      const allItems = [...currentReservationDetails.selectedDishes, ...currentReservationDetails.additionalItems];

      for (const item of allItems) {
        const detailPayload = {
          orderId,
          categoryId: item.categoryId,
          variantId: item.selectedVariant,
          price: parseFloat(item.price),
        };

        console.log('Detail Payload:', detailPayload);

        await axios.post(
          'https://t2305mpk320241031161932.azurewebsites.net/api/CustOrderDetail',
          detailPayload,
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Gửi email thông báo sau khi các API trước đó thành công
      try {
        const emailResponse = await axios.post(
          `https://t2305mpk320241031161932.azurewebsites.net/api/Mail/invoice/${orderId}`,

          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Email Response:', emailResponse.data);
        alert('Thanh toán thành công và email đã được gửi!');
      } catch (emailError) {
        console.error('Gửi email thất bại:', emailError.response?.data || emailError.message);
        alert(`Thanh toán thành công nhưng gửi email thất bại: ${JSON.stringify(emailError.response?.data || emailError.message)}`);
      }

      // alert('Thanh toán thành công!');
      console.log('Thanh toán thành công!');
      // Điều hướng sang trang khác với orderId
      navigate(`/orderDetail/${orderId}`);
    } catch (error) {
      // console.error('Lỗi khi thanh toán:', error);
      // alert('Thanh toán thất bại!');
      console.error('Lỗi khi thanh toán:', error.response?.data || error.message);
      alert(`Thanh toán thất bại! Chi tiết lỗi: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  //sidebar
  const handleCategoryToggle = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };
  const [allMenuItems, setAllMenuItems] = useState([]); // Dữ liệu toàn bộ món
  const [selectedType, setSelectedType] = useState(null); // Loại món hiện tại (ví dụ: Cá Chiên, Cá Tươi)

  // Fetch toàn bộ món để lọc theo loại (type)
  const fetchFishMenuItems = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/with-variants'
      );
      setMenuItems(response.data.filter((item) => item.type === type) || []); // Lọc theo type
      setSelectedCategoryId(null); // Xóa tab khi chọn loại món cá
      setSelectedType(type); // Ghi nhận loại món cá
    } catch (err) {
      setError('Không thể tải dữ liệu món cá.');
    } finally {
      setLoading(false);
    }
  };
  //End sidebar

  //Tìm kiếm
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
  // Fetch menu items dựa trên từ khóa tìm kiếm
  const fetchMenuItemsBySearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/with-variants'
      );
      const filteredItems = response.data.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query.toLowerCase()) &&
          item.categoryId >= 1 &&
          item.categoryId <= 4 // Chỉ lấy các món có categoryId từ 1 đến 4
      );
      setMenuItems(filteredItems || []);
      setSelectedType(null); // Reset type khi tìm kiếm
      setSelectedCategoryId(null); // Reset category khi tìm kiếm
    } catch (err) {
      setError('Không thể tải dữ liệu món ăn theo tìm kiếm.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <PayPalScriptProvider options={{ "client-id": "AedSI6RNn6tJKtT5d2BzI-hNqk6tvg7GOBMyvJVCsW_r7jscFtP2k76qOLIkNFRqy13sdyjvkU06v8tI", currency: "USD" }}>
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

                  <div style={{ position: 'relative' }}>

                    <div className="book-btn">
                      <a href="#reservation" className="table-btn hvr-underline-from-center" onClick={togglePopup}>
                        Book my Table
                      </a>
                    </div>

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
                                    value={searchQuery}
                                    onChange={(e) => {
                                      setSearchQuery(e.target.value);
                                      if (e.target.value.trim() === '') {
                                        setMenuItems([]); // Xóa kết quả khi không có từ khóa
                                      } else {
                                        fetchMenuItemsBySearch(e.target.value); // Fetch dữ liệu khi tìm kiếm
                                      }
                                    }}
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
                                    {/* Accordion: Món Gà */}
                                    <button
                                      onClick={() => handleCategoryToggle('chicken')}
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
                                      <div>Món Gà</div>
                                    </button>

                                    {selectedCategory === 'chicken' && (
                                      <div
                                        style={{
                                          marginTop: '10px',
                                          // paddingLeft: '10px',
                                          // borderLeft: '2px solid #ddd',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '10px',
                                        }}
                                      >
                                        <button
                                          onClick={() => fetchFishMenuItems('Gà Rán')} // Gọi API để lấy món Gà Rán
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          Món Gà Rán
                                        </button>
                                        <button
                                          onClick={() => fetchFishMenuItems('Gà hấp')} // Gọi API để lấy món Gà Hấp
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          Món Gà Hấp
                                        </button>
                                      </div>
                                    )}



                                    {/* Accordion: Món Cá */}
                                    <button
                                      onClick={() => handleCategoryToggle('fish')}
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
                                      <div>Món Cá</div>
                                    </button>

                                    {selectedCategory === 'fish' && (
                                      <div
                                        style={{
                                          marginTop: '10px',
                                          // paddingLeft: '10px',
                                          // borderLeft: '2px solid #ddd',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '10px',
                                        }}
                                      >
                                        <button
                                          onClick={() => fetchFishMenuItems('Cá tươi')} // Gọi API để lấy món Cá Tươi
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          Món Cá Tươi
                                        </button>
                                        <button
                                          onClick={() => fetchFishMenuItems('Cá Chiên')} // Gọi API để lấy món Cá Chiên
                                          style={{
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffe0b2',
                                            borderRadius: '5px',
                                          }}
                                        >
                                          Món Cá Chiên
                                        </button>
                                      </div>
                                    )}
                                    {/* Hiển thị các mục con của Bữa phụ */}
                                    {/* {selectedCategory === 'side' && (
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
                                    )} */}

                                    <button
                                      onClick={() => fetchFishMenuItems('Cơm')} // Gọi API để lấy món Cơm
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
                                        Món Cơm
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => fetchFishMenuItems('Bò ')} // Gọi API để lấy món Bò
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
                                        Món Bò
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
                                          <div style={{ flexGrow: 1 }}>
                                            <h7>{dish.itemName}</h7>
                                            <div>
                                              {' '}
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
                                                    {`Size  `}
                                                    {variant.sizeId === 1 && '6'}
                                                    {variant.sizeId === 2 && '8'}
                                                    {variant.sizeId === 3 && '1'}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div>${dish.price.toFixed(2)}</div>
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
                                      .toFixed(2)} (Giá của 1 bàn)
                                  </div>
                                  <button
                                    onClick={handleConfirm}
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
                                    Next
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

                                        {loading && <p>Đang tải dữ liệu...</p>}
                                        {error && <p>{error}</p>}

                                        {/* Accordion: Trang trí sự kiện */}
                                        <div
                                          style={{
                                            marginBottom: '20px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <div
                                            style={{
                                              backgroundColor: '#f9f9f9',
                                              padding: '15px 20px',
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => toggleCategory(5)} // Toggle Trang trí sự kiện
                                          >
                                            <h3 style={{ fontSize: '18px', color: '#333' }}>Trang trí sự kiện</h3>
                                          </div>
                                          {expandedCategory === 5 && (
                                            <div style={{ padding: '10px' }}>
                                              {eventDecorations.map((item) => (
                                                <div
                                                  key={item.menuItemNo}
                                                  style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '10px',
                                                    gap: '10px',
                                                    border: '1px solid #ddd',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                  }}
                                                >
                                                  {/* Hình ảnh */}
                                                  <img
                                                    src={item.imageURL}
                                                    alt={item.itemName}
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

                                                      {item.itemName}
                                                    </label>
                                                  </div>

                                                  <div style={{ flex: 1 }}>
                                                    <strong>{item.itemName}</strong>
                                                    <p style={{ fontSize: '14px', color: '#555' }}>${item.price.toFixed(2)}</p>
                                                  </div>
                                                  <input
                                                    type="checkbox"
                                                    checked={reservationDetails.additionalItems.some(
                                                      (selectedItem) => selectedItem.menuItemNo === item.menuItemNo
                                                    )}
                                                    onChange={() => toggleAdditionalItem(item)}
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        {/* Accordion: Dịch vụ âm nhạc */}
                                        <div
                                          style={{
                                            marginBottom: '20px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                          }}
                                        >
                                          <div
                                            style={{
                                              backgroundColor: '#f9f9f9',
                                              padding: '15px 20px',
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => toggleCategory(6)} // Toggle Dịch vụ âm nhạc
                                          >
                                            <h3 style={{ fontSize: '18px', color: '#333' }}>Dịch vụ âm nhạc</h3>
                                          </div>
                                          {expandedCategory === 6 && (
                                            <div style={{ padding: '10px' }}>
                                              {musicServices.map((item) => (
                                                <div
                                                  key={item.menuItemNo}
                                                  style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '10px',
                                                    gap: '10px',
                                                    border: '1px solid #ddd',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                  }}
                                                >
                                                  {/* Hình ảnh */}
                                                  <img
                                                    src={item.imageURL}
                                                    alt={item.itemName}
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

                                                      {item.itemName}
                                                    </label>
                                                  </div>

                                                  <div style={{ flex: 1 }}>
                                                    <strong>{item.itemName}</strong>
                                                    <p style={{ fontSize: '14px', color: '#555' }}>${item.price.toFixed(2)}</p>
                                                  </div>
                                                  <input
                                                    type="checkbox"
                                                    checked={reservationDetails.additionalItems.some(
                                                      (selectedItem) => selectedItem.menuItemNo === item.menuItemNo
                                                    )}
                                                    onChange={() => toggleAdditionalItem(item)}
                                                  />

                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => {
                                            setIsConfirmationPopupOpen(false); // Đóng popup món thêm
                                            setIsOrderPopupOpen(true); // Mở popup Order
                                            console.log('Order confirmed:', reservationDetails);
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
                                          }}
                                        >
                                          Xác nhận
                                        </button>

                                      </div>
                                    </div>
                                  )}





                                </div>
                              </div>
                              {isOrderPopupOpen && (
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
                                    color: '#686868',
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: 'white',
                                      padding: '40px',
                                      borderRadius: '15px',
                                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                      textAlign: 'center',
                                      maxWidth: '1700px',
                                      maxHeight: '1700px',
                                      width: '90%',
                                      height: '90%',
                                      display: 'flex',
                                      flexDirection: 'row', // Chia đôi giao diện
                                      gap: '20px',
                                    }}
                                  >
                                    {/* Chi Tiết Menu */}
                                    <div style={{ flex: 1 }}>
                                      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Chi Tiết Menu</h2>
                                      <div style={{ textAlign: 'left', fontSize: '16px' }}>
                                        {reservationDetails.selectedDishes.map((dish) => (
                                          <div key={dish.menuItemNo} style={{ marginBottom: '20px' }}>
                                            <h3>
                                              {dish.categoryId === 1 ? 'STARTERS' : dish.categoryId === 2 ? 'MAIN DISHES' : dish.categoryId === 3 ? 'DESERTS' : 'DRINKS'}
                                            </h3>
                                            <strong>{dish.itemName}</strong> x {reservationDetails.numTables} ${dish.price.toFixed(2)}
                                          </div>
                                        ))}
                                        {reservationDetails.additionalItems.map((item) => (
                                          <div key={item.menuItemNo} style={{ marginBottom: '20px' }}>
                                            <h3>
                                              {item.categoryId === 5 ? 'Event Decorations' : 'Event Services'}
                                            </h3>
                                            <strong>{item.itemName}</strong> $ {item.price.toFixed(2)}
                                          </div>
                                        ))}
                                      </div>
                                      <hr style={{ margin: '20px 0' }} />
                                      <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'right' }}>
                                        Total Cost: $ {calculateTotalCost()}
                                      </div>
                                      <div style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'right', color: 'red' }}>
                                        Deposit Total (30% of Total Cost): $ {calculateDepositAmount()}
                                      </div>
                                      {/* //thanh toán */}
                                      {/* <button
                                        onClick={handleCheckout}
                                        style={{
                                          fontSize: '36px',
                                          color: 'black',
                                          cursor: 'pointer',
                                          border: 'none',
                                          background: 'none',
                                        }}
                                      >Test</button> */}
                                      <PayPalButtons
                                        style={{ layout: 'vertical' }}
                                        createOrder={(data, actions) => {

                                          return actions.order.create({
                                            purchase_units: [{
                                              amount: {
                                                value: calculateDepositAmount(),
                                              },
                                            }],
                                          });
                                        }}
                                        onApprove={async (data, actions) => {
                                          const order = await actions.order.capture();
                                          console.log('PayPal Order:', order);
                                          alert(`Transaction completed by ${order.payer.name.given_name}`);
                                          handleCheckout();
                                        }}
                                        onError={(err) => {
                                          console.error('PayPal Checkout Error:', err);
                                          alert('Payment failed');
                                        }}
                                      />
                                    </div>

                                    {/* Thông Tin Booking */}
                                    <div style={{ flex: 1 }}>
                                      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Thông Tin Booking</h2>
                                      <form>
                                        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                                          <label style={{ fontWeight: 'bold' }}>Người đặt:</label>
                                          <input
                                            type="text"
                                            value={reservationDetails.customerName || ''}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            style={{
                                              width: '100%',
                                              padding: '10px',
                                              borderRadius: '5px',
                                              border: '1px solid #ddd',
                                            }}
                                          />
                                        </div>
                                        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                                          <label style={{ fontWeight: 'bold' }}>Điện thoại:</label>
                                          <input
                                            type="text"
                                            value={reservationDetails.customerPhone || ''}
                                            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                            style={{
                                              width: '100%',
                                              padding: '10px',
                                              borderRadius: '5px',
                                              border: '1px solid #ddd',
                                            }}
                                          />
                                        </div>
                                        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                                          <label style={{ fontWeight: 'bold' }}>Email:</label>
                                          <input
                                            type="email"
                                            value={reservationDetails.customerEmail || ''}
                                            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                            style={{
                                              width: '100%',
                                              padding: '10px',
                                              borderRadius: '5px',
                                              border: '1px solid #ddd',
                                            }}
                                          />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                          <label htmlFor="orderNote" style={{ fontWeight: 'bold', color: '#333' }}>
                                            Yêu cầu thêm:
                                          </label>
                                          <textarea
                                            id="orderNote"
                                            value={reservationDetails.orderNote || ''}
                                            onChange={(e) => handleInputChange('orderNote', e.target.value)}
                                            placeholder="Nhập yêu cầu thêm..."
                                            style={{
                                              width: '100%',
                                              height: '100px',
                                              padding: '10px',
                                              borderRadius: '5px',
                                              border: '1px solid #ddd',
                                              resize: 'vertical',
                                              fontSize: '14px',
                                            }}
                                          />
                                        </div>

                                      </form>
                                      <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '16px' }}>
                                        <strong>Địa điểm tổ chức:</strong> {getRestaurantName(reservationDetails.restaurant) || 'Loading...'}
                                        <br />
                                        <strong>Số người tham gia:</strong> {reservationDetails.numPeople}
                                        <br />
                                        <strong>Số người mỗi bàn:</strong> {reservationDetails.numPeoplePerTable || 6}
                                        <br />
                                        <strong>Số bàn:</strong> {reservationDetails.numTables}
                                        <br />
                                        <strong>Thời gian tổ chức:</strong>{' '}
                                        {reservationDetails.date} vào lúc {reservationDetails.time}
                                        <p style={{ fontWeight: 'bold', fontSize: '18px', color: 'red' }}><strong>You must deposit 30% of Total Cost in advance to book the party </strong></p>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                              )}

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
      {/* // <!-- end banner --> */}
    </PayPalScriptProvider>
  );
}
