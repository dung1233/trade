import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/UserProfile.css';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const [user, setUser] = useState({
        customerId: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        imageURL: '',
    });

    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const fetchUserData = async () => {
            try {
                const userInfoResponse = await axios.get(
                    'https://t2305mpk320241031161932.azurewebsites.net/api/UserProfile/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const userData = userInfoResponse.data;
                setUser({
                    customerId: userData.customerId,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    imageURL: userData.imageURL,
                });
                fetchUserOrders(userData.customerId);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const fetchUserOrders = async (customerId) => {
        try {
            const ordersResponse = await axios.get(
                `https://t2305mpk320241031161932.azurewebsites.net/api/CustOrder/by-customer/${customerId}`
            );
            const userOrders = ordersResponse.data.filter(order => order.customerId === customerId);
            setOrders(userOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCancelOrder = async (order) => {
        // Check if the order is in a "Pending" state
        if (order.status !== 'Pending') {
            alert('You are only allowed to cancel orders with a status of "Pending".');
            return;
        }

        try {
            const response = await axios.put(
                `https://t2305mpk320241031161932.azurewebsites.net/api/CustOrder/${order.orderId}/cancel`
            );
            if (response.status === 200 || response.status === 204) {
                alert('Order cancelled successfully!');
                fetchUserOrders(user.customerId); // Fetch the latest orders to reflect changes
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Unable to cancel the order.');
        }
    };

    const formatDateTime = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <div className="container">
            <div className="main-body">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <img src="img/avatars/default.png" alt="User" className="rounded-circle avatar" width="150" />
                                <h4>{user.name || ''}</h4>
                                <p className="text-secondary mb-1">Full Stack Developer</p>
                                <p className="text-muted">{user.address || ''}</p>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Full Name</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.name || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Email</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.email || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Phone</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.phone || ''}</div>
                                </div>
                                <hr />
                                <div className="row mb-2">
                                    <div className="col-sm-3"><h6 className="mb-0">Address</h6></div>
                                    <div className="col-sm-9 text-secondary">{user.address || ''}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                    {/* Orders Section */}
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="order-section">
                                <h3 style={{ paddingLeft: '10px' }}>Recent Orders</h3>
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Booking Date</th>
                                            <th>Status</th>
                                            <th>Deposit</th>
                                            <th>Total</th>
                                            <th>View</th>
                                            <th>Cancel</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length > 0 ? (
                                            orders.map((order, index) => (
                                                <tr key={order.orderId}>
                                                    <td>{index + 1}</td>
                                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                    <td>{order.name}</td>
                                                    <td>{formatDateTime(order.eventTime)}</td>
                                                    <td style={{
                                                        color: order.status === 'Refuned' || order.status === 'Denied' || order.status === 'Cancelled' ? 'red' :
                                                            order.status === 'Pending' ? 'orange' : 'green'
                                                    }}>
                                                        {order.status}
                                                    </td>
                                                    <td>${order.depositCost}</td>
                                                    <td>${order.totalCost}</td>
                                                    <td>
                                                        <button className="btn btn-info">
                                                            <Link to={`/orderDetail/${order.orderId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                                View
                                                            </Link>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleCancelOrder(order)}
                                                            className="btn btn-danger"
                                                            disabled={order.status !== 'Pending'}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9">No recent orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
