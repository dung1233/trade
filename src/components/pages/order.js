import OrderBanner from '../Order/OrderBanner';
import OrderDetail from '../Order/OrderDetail';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function Order() {
    useEffect(() => {
        AOS.init({
          duration: 1000,
          offset: 100,   
          easing: 'ease-in-out',
          once: true    
        });
      }, []);
    return(
        <div>
            <OrderBanner />
            <OrderDetail/>
           
        </div>
    )
}