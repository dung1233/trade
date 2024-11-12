import SignUpBox from '../login/SignUpBox';
import SignUpBanner from '../login/SignUpBanner';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function Register() {
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
            <SignUpBanner />
            <SignUpBox/>
        </div>
    )
}