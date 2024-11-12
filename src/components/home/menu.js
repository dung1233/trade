import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';

export default function Menu({ onOpenMenuConfirmation }) {
    const sliderRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedSizes, setSelectedSizes] = useState({});
    const [openItemId, setOpenItemId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [menuItems, setMenuItems] = useState({
        starters: [],
        mainDishes: [],
        deserts: [],
        drinks: []
    });
    const [itemVariants, setItemVariants] = useState({});

    const personOptions = [
        { value: 6, label: '6' },
        { value: 8, label: '8' },
        { value: 10, label: '10' },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const handleTabClick = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
        }
        setActiveTab(index);
    };

    const fetchItemVariants = async (menuItemNo) => {
        try {
            const response = await axios.get(`https://t2305mpk320241031161932.azurewebsites.net/api/ItemVariants/by-menuitem/${menuItemNo}`);
            setItemVariants((prev) => ({ ...prev, [menuItemNo]: response.data }));
        } catch (error) {
            console.error('Error fetching item variants:', error);
        }
    };

    const handleSizeChange = (item, event) => {
        const selectedSize = event.target.value;
    
        if (selectedSize === "") {
            setSelectedSizes((prev) => {
                const updatedSizes = { ...prev };
                delete updatedSizes[item.menuItemNo];
                localStorage.setItem('menu', JSON.stringify(updatedSizes));
                return updatedSizes;
            });
        } else {
            const sizeId = parseInt(selectedSize);

            if (itemVariants[item.menuItemNo]) {
                const selectedVariant = itemVariants[item.menuItemNo].find(
                    (variant) => variant.size.sizeId === sizeId
                );
    
                if (selectedVariant) {
                    setSelectedSizes((prev) => {
                        const updatedSizes = {
                            ...prev,
                            [item.menuItemNo]: {
                                size: sizeId,
                                sizeNumber: selectedVariant.size.sizeNumber,
                                name: item.itemName,
                                type: item.type,
                                price: selectedVariant.price,
                                image: item.imageURL,
                                categoryId: item.categoryId, // Lưu categoryId để kiểm tra
                                variantId: selectedVariant.variantId // Add variantId here
                            },
                        };
                        localStorage.setItem('menu', JSON.stringify(updatedSizes));
                        return updatedSizes;
                    });
                }
            }
        }
    };

    const handleItemClick = (itemId) => {
        setOpenItemId((prev) => (prev === itemId ? null : itemId));
        if (!itemVariants[itemId]) {
            fetchItemVariants(itemId);
        }
    };

    const isValidSelection = () => {
        // Các ID loại cần chọn ít nhất một mục
        const requiredCategories = [1, 2, 3, 4];
        // Kiểm tra nếu mỗi loại đều có ít nhất một mục trong selectedSizes
        return requiredCategories.every(categoryId => {
            return Object.values(selectedSizes).some(item => item.categoryId === categoryId);
        });
    };
    
    const handleBookTableClick = () => {
        if (isValidSelection()) {
            setErrorMessage('');
            onOpenMenuConfirmation(selectedSizes);
        } else {
            setErrorMessage('Please select at least one item from each category.');
        }
    };

    useEffect(() => {
        const savedSizes = localStorage.getItem('menu');
        if (savedSizes) {
            setSelectedSizes(JSON.parse(savedSizes));
        }
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const categories = ['starters', 'mainDishes', 'deserts', 'drinks'];
                const categoryIds = [1, 2, 3, 4];

                const responses = await Promise.all(
                    categoryIds.map(id =>
                        axios.get(`https://t2305mpk320241031161932.azurewebsites.net/api/MenuItem/by-category/${id}`)
                    )
                );

                const data = responses.reduce((acc, response, index) => {
                    acc[categories[index]] = response.data;
                    return acc;
                }, {});

                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []);

    const icons = ['canape', 'dinner', 'desert', 'coffee'];
    const activeClass = "active-tab";

    return (
        <div id="menu" className="menu-main pad-top-100 pad-bottom-100" data-aos="fade-up">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="wow fadeIn" data-wow-duration="1s" data-wow-delay="0.1s">
                            <h2 className="block-title text-center">Our Menu</h2>
                            <p className="title-caption text-center">
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                            </p>
                        </div>
                        <div className="tab-menu">
                            <div className="slider slider-nav row">
                                {['STARTERS', 'MAIN DISHES', 'DESERTS', 'DRINKS'].map((title, index) => (
                                    <div 
                                        className={`tab-title-menu col-lg-3 col-md-3 col-sm-3 col-xs-3 ${activeTab === index ? activeClass : ''}`} 
                                        onClick={() => handleTabClick(index)} 
                                        key={index}
                                    >
                                        <h2>{title}</h2>
                                        <p><i className={`flaticon-${icons[index]}`}></i></p>
                                    </div>
                                ))}
                            </div>
                            <Slider ref={sliderRef} {...settings} className="slider slider-single">
                                {['starters', 'mainDishes', 'deserts', 'drinks'].map((type, index) => (
                                    <div key={index}>
                                        {menuItems[type].map(item => (
                                            <div 
                                                className="col-lg-6 col-md-6 col-sm-12 col-xs-12 menu-position"
                                                key={item.menuItemNo} 
                                                style={{ 
                                                    borderColor: selectedSizes[item.menuItemNo] ? '#e75b1e' : 'transparent', 
                                                    borderWidth: '5px', 
                                                    borderStyle: 'solid', 
                                                    borderRadius: '5px', 
                                                    padding: "3px" 
                                                }}
                                                onClick={() => handleItemClick(item.menuItemNo)}
                                            >
                                                <div className="offer-item">
                                                    <img src={item.imageURL} alt={item.itemName} className="img-responsive" />
                                                    <div>
                                                        <a href="#">{item.itemName}</a>
                                                        <p style={{height: "50px", overflow:"hidden"}}>{item.description}</p>
                                                        <div className="size-selection">
                                                            <select
                                                                id={`size-${item.menuItemNo}`}
                                                                value={selectedSizes[item.menuItemNo]?.size || ''}
                                                                onChange={(event) => handleSizeChange(item, event)}
                                                                style={{padding: "5px 20px"}}
                                                            >
                                                                <option value="">Select</option>
                                                                {itemVariants[item.menuItemNo]?.map(variant => (
                                                                    <option key={variant.size.sizeId} value={variant.size.sizeId}>
                                                                        {variant.size.sizeNumber}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <span className="offer-price">${selectedSizes[item.menuItemNo]?.price || item.price}</span>
                                                </div>
                                            </div>
                                        ))} 
                                    </div>
                                ))}
                            </Slider>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="reserve-book-btn text-center">
                                    {errorMessage && <p className="error-message" style={{color: "red"}}>{errorMessage}</p>}
                                    <button 
                                        className="hvr-underline-from-center" 
                                        type="button" 
                                        onClick={handleBookTableClick}
                                    >
                                        BOOK MY TABLE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
