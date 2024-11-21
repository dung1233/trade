import React, { useRef, useEffect } from 'react';
import Typed from 'typed.js';

export default function LoginBanner() {
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    if (el.current) {
      // Khởi tạo Typed.js
      typed.current = new Typed(el.current, {
        strings: [' Welcome', 'To'],
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

  return (
    <div id="banner" className="banner full-screen-mode parallax">
      <div className="container pr">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="banner-static">
            <div className="banner-text">
              <div className="banner-cell">
                <h1>
                  <span ref={el} style={{color: "#e75b1e"}}></span>  
                  Login Page{' '}
                  
                  <span className="cursor">_</span>
                </h1>
                <h2>Everything is Possible </h2>
                
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
    </div>
    // <!-- end banner -->
  );
}
