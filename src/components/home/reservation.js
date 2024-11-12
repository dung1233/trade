import React, { useState, useEffect } from 'react'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axios from 'axios';

export default function Reservation() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectPerson, setSelectPerson] = useState(null);
    const [formName, setFormName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [person, setPerson] = useState('');
    const [addressOptions, setAddressOptions] = useState([]); // Store restaurant options

    const personOptions = [
        { value: 1, label: 6 },
        { value: 2, label: 8 },
        { value: 3, label: 10 },
    ];

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

    return (
        <div id="reservation" className="reservations-main pad-top-100 pad-bottom-100" data-aos="fade-up">
            <div className="container">
                <div className="row">
                    <div className="form-reservations-box">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
                                <h2 className="block-title text-center">Reservations</h2>
                            </div>
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
    );
}
