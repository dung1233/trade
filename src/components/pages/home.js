import React, { useEffect, useState } from "react";
import Banner from "../home/banner";
import About from "../home/about";
import SpecialMenu from "../home/specialMenu";
import Menu from "../home/menu";
import Team from "../home/team";
import Gallery from "../home/gallery";
import Blog from "../home/blog";
import Price from "../home/price";
import Reservation from "../home/reservation";
import MenuConfirmation from "../home/MenuConfirmation";
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function Home() {
    const [isMenuConfirmationOpen, setIsMenuConfirmationOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState({});

    useEffect(() => {
        AOS.init({
            duration: 1000,
            offset: 100,   
            easing: 'ease-in-out',
            once: true    
        });
    }, []);

    const handleOpenMenuConfirmation = (sizes) => {
        setSelectedSizes(sizes);
        setIsMenuConfirmationOpen(true);
    };

    return (
        <div>
       
            <Banner />
            <About />
            <SpecialMenu />
            
            <Menu onOpenMenuConfirmation={handleOpenMenuConfirmation} /> {/* Truyền hàm vào Menu */}
            <Team />
            {/* <Gallery /> */}
            {/* <Blog /> */}
            {/* <Price /> */}
            {/* <Reservation /> */}
            {/* Render MenuConfirmation nếu isMenuConfirmationOpen là true */}
            {isMenuConfirmationOpen && (
                <MenuConfirmation 
                    onClose={() => setIsMenuConfirmationOpen(false)} 
                    selectedSizes={selectedSizes}
                />
            )}
        </div>
    );
}
