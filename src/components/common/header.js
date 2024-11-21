import React, { useEffect, useState } from 'react';
import { Link as ScrollLink, Events, scrollSpy } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [activeLink, setActiveLink] = useState('banner');
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);

      const sections = ['banner', 'about', 'menu', 'our_team', 'gallery', 'blog', 'pricing', 'reservation', 'footer'];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 0 && rect.bottom > 0) {
            setActiveLink(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    Events.scrollEvent.register('begin', function () { });
    Events.scrollEvent.register('end', function (to) {
      setActiveLink(to);
    });

    scrollSpy.update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.get('https://t2305mpk320241031161932.azurewebsites.net/api/UserProfile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          setFullName(response.data.name);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setFullName('');
    navigate('/'); // Redirect to the home page after logout
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleProfileClick = () => {
    navigate('/profile'); // Điều hướng đến trang Profile
  };

  return (
    <div id="site-header">
      <header id="header" className={`header-block-top ${isSticky ? 'sticky' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="main-menu">
              <nav className="navbar navbar-default" id="mainNav">
                <div className="navbar-header">
                  <button
                    type="button"
                    className="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false"
                    aria-controls="navbar"
                  >
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <div className="logo">
                    <a className="navbar-brand js-scroll-trigger logo-header" href="#">
                      <img src="images/logo.png" alt="" />
                    </a>
                  </div>
                </div>
                <div id="navbar" className="navbar-collapse collapse ">
                  <ul className="nav navbar-nav  ">
                    {/* Scroll Links */}
                    <li className={activeLink === 'banner' ? 'active' : ''}>
                      <ScrollLink to="banner" spy={true} smooth={true} duration={500}>
                        <RouterLink to="/" style={{
                          all: 'unset',
                          cursor: 'pointer',

                          display: 'block',
                          textAlign: 'left',
                          color: 'inherit', // Đảm bảo giữ nguyên màu chữ
                        }}>
                          Home
                        </RouterLink>

                      </ScrollLink>
                    </li>
                    <li className={activeLink === 'about' ? 'active' : ''}>
                      <ScrollLink to="about" spy={true} smooth={true} duration={500}>
                        About us
                      </ScrollLink>
                    </li>
                    {/* <li className={activeLink === 'reservation' ? 'active' : ''}>
                      <ScrollLink to="reservation" spy={true} smooth={true} duration={500}>
                        Reservation
                      </ScrollLink>
                    </li> */}
                    <li className={activeLink === 'menu' ? 'active' : ''}>
                      <ScrollLink to="menu" spy={true} smooth={true} duration={500}>
                        Menu
                      </ScrollLink>
                    </li>
                    <li className={activeLink === 'our_team' ? 'active' : ''}>
                      <ScrollLink to="our_team" spy={true} smooth={true} duration={500}>
                        Team
                      </ScrollLink>
                    </li>
                    {/* <li className={activeLink === 'gallery' ? 'active' : ''}>
                      <ScrollLink to="gallery" spy={true} smooth={true} duration={500}>
                        Gallery
                      </ScrollLink>
                    </li>
                    <li className={activeLink === 'blog' ? 'active' : ''}>
                      <ScrollLink to="blog" spy={true} smooth={true} duration={500}>
                        Blog
                      </ScrollLink>
                    </li> */}
                    {/* <li className={activeLink === 'pricing' ? 'active' : ''}>
                      <ScrollLink to="pricing" spy={true} smooth={true} duration={500}>
                        Pricing
                      </ScrollLink>
                    </li> */}
                    <li className={activeLink === 'footer' ? 'active' : ''}>
                      <ScrollLink to="footer" spy={true} smooth={true} duration={500}>
                        Contact us
                      </ScrollLink>
                    </li>

                    {/* Conditional Rendering based on Login Status */}
                    {fullName ? (
                      <li className="dropdown">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          onClick={toggleDropdown}
                        >
                          {fullName} <span className="caret"></span>
                        </a>
                        {isDropdownOpen && (
                          <ul className="dropdown-menu" style={{ display: 'block', position: 'absolute' }}>
                            <li>

                              {/* Nút Profile */}
                              <button
                                onClick={handleProfileClick} // Gọi điều hướng khi bấm
                                className="logout-btn"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '8px 16px',
                                  width: '100%',
                                  textAlign: 'left',
                                }}
                              >
                                Profile
                              </button>

                            </li>
                            <li>
                              <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', width: '100%', textAlign: 'left' }}>
                                Logout
                              </button>
                            </li>
                          </ul>
                        )}
                      </li>
                    ) : (
                      <>
                        <li>
                          <RouterLink to="/login">Login</RouterLink>
                        </li>
                        <li>
                          <RouterLink to="/register">Register</RouterLink>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
