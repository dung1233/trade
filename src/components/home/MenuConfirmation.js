import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function MenuConfirmation({ onClose }) {
    const [selectedSizes, setSelectedSizes] = useState({});
    const [reservationDetails, setReservationDetails] = useState({});
    const [restaurantName, setRestaurantName] = useState("");

    useEffect(() => {
        const savedMenu = localStorage.getItem('menu');
        const savedReservation = localStorage.getItem('reservation');

        if (savedMenu) {
            setSelectedSizes(JSON.parse(savedMenu));
        }

        if (savedReservation) {
            const reservation = JSON.parse(savedReservation);
            setReservationDetails(reservation);

            if (reservation.selectedAddress) {
                fetchRestaurantName(reservation.selectedAddress);
            }
        }
    }, []);

    const fetchRestaurantName = async (restaurantId) => {
        try {
            const response = await axios.get(`https://t2305mpk320241031161932.azurewebsites.net/api/Restaurant/${restaurantId}`);
            setRestaurantName(response.data.restaurantName);
        } catch (error) {
            console.error("Failed to fetch restaurant name:", error);
            setRestaurantName("Unknown Restaurant");
        }
    };

    const calculateSubTotal = () => {
        const { person, selectPerson } = reservationDetails;
        let subTotal = 0;

        Object.values(selectedSizes).forEach(item => {
            if (item.categoryId === 4) {
                subTotal += item.price * person;
            } else if ([1, 2, 3].includes(item.categoryId)) {
                const servings = Math.ceil(person / selectPerson);
                subTotal += item.price * servings;
            }
        });

        return subTotal.toFixed(2);
    };

    const calculateDeposit = () => {
        const depositAmount = (calculateSubTotal() * 0.3).toFixed(2);
        localStorage.setItem('deposit', depositAmount);
        return depositAmount;
    };

    const handleCheckout = async () => {
        try {
            const eventDateTime = `${reservationDetails.selectedDate}T${reservationDetails.selectedTime}:00`;

            const orderPayload = {
                orderDate: new Date().toISOString().split('T')[0],
                deliveryDate: reservationDetails.selectedDate,
                name: reservationDetails.formName || "",
                phone: reservationDetails.phone || "",
                email: reservationDetails.email || "",
                eventTime: eventDateTime,
                restaurant_id: parseInt(reservationDetails.selectedAddress, 10) || 0,
                noOfPeople: parseInt(reservationDetails.person, 10) || 0,
                noOfTable: Math.ceil(parseInt(reservationDetails.person, 10) / parseInt(reservationDetails.selectPerson, 10)) || 1,
                depositCost: parseFloat(calculateDeposit()) || 0,
                totalCost: parseFloat(calculateSubTotal()) || 0,
                orderNote: reservationDetails.orderNote || ""
            };

            console.log("Order Payload:", orderPayload);

            const orderResponse = await axios.post(
                'https://t2305mpk320241031161932.azurewebsites.net/api/CustOrder',
                orderPayload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const orderId = orderResponse.data.orderId;

            for (const item of Object.values(selectedSizes)) {
                const detailPayload = {
                    orderId: orderId,
                    categoryId: item.categoryId,
                    variantId: item.variantId,
                    price: parseFloat(item.price)
                };

                console.log("Detail Payload:", detailPayload);

                await axios.post(
                    'https://t2305mpk320241031161932.azurewebsites.net/api/CustOrderDetail',
                    detailPayload,
                    { headers: { 'Content-Type': 'application/json' } }
                );
            }

            alert("Thanh toán thành công!");
            localStorage.removeItem('menu');
            onClose();
        } catch (error) {
            console.error("Đã xảy ra lỗi trong khi gọi API:", error);
            alert(`Thanh toán thất bại! Chi tiết lỗi: ${error.response?.data || error.message}`);
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": "AedSI6RNn6tJKtT5d2BzI-hNqk6tvg7GOBMyvJVCsW_r7jscFtP2k76qOLIkNFRqy13sdyjvkU06v8tI", currency: "USD" }}>
            <div className="menu-confirmation-overlay">
                <div className="menu-confirmation">
                    <header className="header">
                        <h1>Menu Confirmed!</h1>
                    </header>

                    <div className="content">
                        <section className="menu-details">
                            <h2>Chi Tiết Menu</h2>
                            <div style={{ borderBottom: "1px solid #ccc", borderTop: "1px solid #ccc", padding: "10px" }}>
                                {[1, 2, 3, 4].map(categoryId => (
                                    <div key={categoryId} style={{ marginBottom: '20px' }}>
                                        <h3>
                                            {categoryId === 1 ? 'STARTERS' : categoryId === 2 ? 'MAIN DISHES' : categoryId === 3 ? 'DESERTS' : 'DRINKS'}
                                        </h3>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                {Object.values(selectedSizes).filter(item => item.categoryId === categoryId).map((item, index) => {
                                                    let quantity = categoryId === 4 ? reservationDetails.person : Math.ceil(reservationDetails.person / reservationDetails.selectPerson);
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ padding: '8px', width: "60%" }}>{item.name}</td>
                                                            <td style={{ padding: '8px', width: "20%" }}>x {quantity}</td>
                                                            <td style={{ padding: '8px', width: "20%" }}>${item.price.toFixed(2)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                            <div className="total">
                                <span><strong>Total Cost</strong></span>
                                <span style={{ paddingRight: "5%" }}><strong>${calculateSubTotal()}</strong></span>
                            </div>
                            <div className="total">
                                <span><strong>Deposit Total (30% of Total Cost)</strong></span>
                                <span style={{ paddingRight: "5%" }}><strong>${calculateDeposit()}</strong></span>
                            </div>
                        </section>

                        <section className="delivery-info">
                            <h2>Thông Tin Booking</h2>
                            <p><strong>Người đặt:</strong> {reservationDetails.formName || "Tên người đặt"}</p>
                            <p><strong>Điện thoại:</strong> {reservationDetails.phone || "123-456-7890"}</p>
                            <p><strong>Email:</strong> {reservationDetails.email || "example@example.com"}</p>
                            <p><strong>Địa điểm tổ chức:</strong> {restaurantName || "Loading..."}</p>
                            <p><strong>Số người tham gia:</strong> {reservationDetails.person}</p>
                            <p><strong>Số người mỗi bàn:</strong> {reservationDetails.selectPerson}</p>
                            <p><strong>Số bàn:</strong> {Math.ceil(reservationDetails.person / reservationDetails.selectPerson)}</p>
                            <p><strong>Thời gian tổ chức:</strong> {reservationDetails.selectedDate} vào lúc {reservationDetails.selectedTime}</p>
                            <p><strong>You must deposit 30% of Total Cost in advance to book the party </strong></p>
                        </section>
                    </div>

                    <footer className="footer" />
                    <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                            const depositAmount = localStorage.getItem('deposit');
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: depositAmount,
                                    },
                                }],
                            });
                        }}
                        onApprove={async (data, actions) => {
                            const order = await actions.order.capture();
                            alert(`Transaction completed by ${order.payer.name.given_name}`);
                            handleCheckout();
                        }}
                        onError={(err) => {
                            console.error('PayPal Checkout Error:', err);
                            alert('Payment failed');
                        }}
                    />

                    <button onClick={onClose} style={{ display: "flex", float: "right" }}>Đóng</button>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
