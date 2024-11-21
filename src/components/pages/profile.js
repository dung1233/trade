
import UserBanner from '../User/UserBanner';
import UserProfile from '../User/UserProfile';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function Profile() {
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
            <UserBanner/>
            <UserProfile/>
     
        </div>
    )
}