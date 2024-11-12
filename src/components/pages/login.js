// import LoginBox from '../login/LoginBox';
import LoginBanner from '../login/LoginBanner';
import Test from '../home/tes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
export default function Login() {
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
            <LoginBanner />
            {/* <LoginBox/> */}
            <Test/>
        </div>
    )
}